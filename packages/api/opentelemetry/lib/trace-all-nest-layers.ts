// src: https://github.com/amplication/opentelemetry-nestjs/blob/main/src/trace/instrumentation/guard.instrumentation.ts
import {
  context,
  SpanStatusCode,
  type Attributes,
  type Context,
  type Span
} from '@opentelemetry/api'
import { catchError, finalize, throwError, type Observable } from 'rxjs'
import { getOtelTracer } from './get-otel-tracer.js'

/**
 * Nest's enhancer kinds: the metadata key a decorator writes, the method the
 * class must implement, and the `ApplicationConfig` getter for global ones.
 *
 * The metadata keys are inlined rather than imported: importing a runtime value
 * from @nestjs/* would load a second copy of Nest into the process, and its
 * class tokens would then never match the running app's.
 */
const ENHANCERS = [
  { kind: 'guard', method: 'canActivate', metadata: '__guards__', globals: 'getGlobalGuards' },
  { kind: 'interceptor', method: 'intercept', metadata: '__interceptors__', globals: 'getGlobalInterceptors' },
  { kind: 'pipe', method: 'transform', metadata: '__pipes__', globals: 'getGlobalPipes' },
  { kind: 'filter', method: 'catch', metadata: '__exceptionFilters__', globals: 'getGlobalFilters' }
] as const

const MIDDLEWARE_SUFFIX = 'Middleware'
const MIDDLEWARE_METHOD = 'use'
const APP_LAYER_SUFFIXES = ['UseCase', 'Repository']

/** Marks a method this module has already wrapped, so a second pass is a no-op. */
const WRAPPED = Symbol('wisemen.traced')

/** Nest middleware are called as `(req, res, next)`. */
const NEXT_ARGUMENT_INDEX = 2

type Method = (...args: unknown[]) => unknown

interface InstanceWrapper {
  metatype?: unknown
  instance?: unknown
}

interface NestModule {
  controllers: Map<unknown, InstanceWrapper>
  providers: Map<unknown, InstanceWrapper>
}

/** The parts of Nest's container this needs, passed in by the caller. */
export interface NestContainers {
  /** `app.container.getModules().values()` */
  modules: Iterable<NestModule>
  /** `app.container.applicationConfig` */
  config?: Record<(typeof ENHANCERS)[number]['globals'], () => unknown[]>
}

export interface TraceAllNestLayersOptions {
  /** Guards, interceptors, pipes and exception filters. Default true. */
  enhancers?: boolean
  /** Nest middleware classes, so they no longer collapse into one middie span. Default true. */
  middleware?: boolean
  /** Classes named *UseCase / *Repository. Default true. */
  appLayer?: boolean
}

/** One method to wrap: produced by discovery, applied by `traceMethod`. */
interface TraceTarget {
  prototype: object
  methodName: string
  spanName: string
  attributes: Attributes
  /** Middleware pass control to `next()` rather than returning; see `withTracedNext`. */
  isMiddleware?: boolean
}

/**
 * Wraps the Nest layers that no instrumentation covers — middleware, guards,
 * interceptors, exception filters, use cases and repositories — so a trace shows
 * what ran between the HTTP hook and the database.
 *
 * Methods are replaced on `metatype.prototype`, so no live instance is touched.
 * Returns the span names that were wrapped.
 */
export function traceAllNestLayers (
  containers: NestContainers,
  options: TraceAllNestLayersOptions = {}
): string[] {
  const traced: string[] = []

  for (const target of findNestLayerTargets(containers, options)) {
    if (traceMethod(target)) {
      traced.push(target.spanName)
    }
  }

  return traced
}

// ---------------------------------------------------------------------------
// Discovery: what to wrap.
//
// Driven by Nest's own metadata and by `ApplicationConfig`, never by inspecting
// arbitrary providers: wrapping anything that merely looks like an enhancer
// reaches proxy-backed providers and breaks the container.
// ---------------------------------------------------------------------------

function findNestLayerTargets (
  containers: NestContainers,
  options: TraceAllNestLayersOptions
): TraceTarget[] {
  const {
    enhancers = true,
    middleware = true,
    appLayer = true
  } = options

  // `modules` may be a one-shot iterator; each pass needs its own walk.
  const modules = [...containers.modules]
  const targets: TraceTarget[] = []

  if (enhancers && containers.config != null) {
    targets.push(...globalEnhancerTargets(containers.config))
  }

  if (enhancers) {
    targets.push(...handlerEnhancerTargets(modules))
  }

  if (middleware || appLayer) {
    targets.push(...providerTargets(modules, { middleware, appLayer }))
  }

  return targets
}

/** Enhancers registered with APP_GUARD, APP_PIPE, APP_INTERCEPTOR, APP_FILTER. */
function globalEnhancerTargets (config: NonNullable<NestContainers['config']>): TraceTarget[] {
  const targets: TraceTarget[] = []

  for (const { method, globals } of ENHANCERS) {
    for (const enhancer of config[globals]()) {
      // Global enhancers carry no nestjs.* attributes, unlike controller-scoped ones.
      const target = enhancerTarget(enhancer, method, () => ({}))

      if (target != null) {
        targets.push(target)
      }
    }
  }

  return targets
}

/** Enhancers attached to a controller class or one of its handlers. */
function handlerEnhancerTargets (modules: NestModule[]): TraceTarget[] {
  const targets: TraceTarget[] = []

  for (const module of modules) {
    for (const controller of module.controllers.values()) {
      const metatype = controller.metatype as (new (...args: never[]) => unknown) | undefined

      if (typeof metatype !== 'function') {
        continue
      }

      const handlers = allMethods(metatype.prototype as object | undefined)
      const decorated: object[] = [metatype, ...handlers.map(([, handler]) => handler)]

      for (const source of decorated) {
        for (const { kind, method, metadata } of ENHANCERS) {
          const attached = (Reflect.getMetadata(metadata, source) ?? []) as unknown[]

          for (const enhancer of attached) {
            const target = enhancerTarget(enhancer, method, className => ({
              'nestjs.type': kind,
              'nestjs.provider': className,
              'nestjs.scope': 'controller'
            }))

            if (target != null) {
              targets.push(target)
            }
          }
        }
      }
    }
  }

  return targets
}

/** Middleware and conventionally-named application classes. */
function providerTargets (
  modules: NestModule[],
  options: { middleware: boolean, appLayer: boolean }
): TraceTarget[] {
  const targets: TraceTarget[] = []

  for (const module of modules) {
    // Middleware are found here only when they are also declared as providers:
    // `consumer.apply()` records them in Nest's MiddlewareContainer, which is
    // not populated until `app.init()`, after this runs.
    for (const wrapper of module.providers.values()) {
      const resolved = resolveClass(wrapper)

      if (resolved == null) {
        continue
      }

      const { prototype, className } = resolved

      if (options.middleware && isMiddleware(className, prototype)) {
        targets.push({
          prototype,
          methodName: MIDDLEWARE_METHOD,
          spanName: `${className}.${MIDDLEWARE_METHOD}`,
          attributes: { 'nestjs.type': 'middleware', 'nestjs.provider': className },
          isMiddleware: true
        })

        continue
      }

      if (!options.appLayer || !isAppLayer(className)) {
        continue
      }

      for (const [name] of allMethods(prototype)) {
        if (name.startsWith('_')) {
          continue
        }

        targets.push({
          prototype,
          methodName: name,
          spanName: `${className}.${name}`,
          attributes: { 'nestjs.type': 'application', 'nestjs.provider': className }
        })
      }
    }
  }

  return targets
}

/**
 * A provider is normally a class, but `useFactory` and `useValue` ones carry no
 * usable metatype, so the built instance is read instead.
 */
function resolveClass (wrapper: InstanceWrapper): { prototype: object, className: string } | null {
  const metatype = wrapper.metatype as (new (...args: never[]) => unknown) | undefined
  const fromMetatype = typeof metatype === 'function'
    ? metatype.prototype as object | undefined
    : undefined

  if (fromMetatype != null && metatype?.name != null && metatype.name !== '') {
    return { prototype: fromMetatype, className: metatype.name }
  }

  const instance = wrapper.instance

  if (typeof instance !== 'object' || instance === null) {
    return null
  }

  const prototype = Object.getPrototypeOf(instance) as object | null
  const className = instance.constructor?.name

  // A plain object has nothing to wrap and no class to name a span after.
  if (prototype == null || prototype === Object.prototype || className == null || className === '') {
    return null
  }

  return { prototype, className }
}

function enhancerTarget (
  enhancer: unknown,
  methodName: string,
  buildAttributes: (className: string) => Attributes
): TraceTarget | null {
  const prototype = prototypeOf(enhancer)
  const className = classNameOf(enhancer)

  if (prototype == null || className == null) {
    return null
  }

  return {
    prototype,
    methodName,
    spanName: `${className}.${methodName}`,
    attributes: buildAttributes(className)
  }
}

/**
 * Methods on the prototype and everything it inherits from, as `[name, method]`
 * pairs. A repository may declare `findById` itself but inherit `countAll` from
 * a base class, and both deserve a span. Mirrors Nest's own `MetadataScanner`.
 */
function allMethods (prototype: object | undefined): Array<[string, Method]> {
  const methods: Array<[string, Method]> = []
  const seen = new Set<string>()
  let current = prototype

  while (current != null && current !== Object.prototype) {
    for (const name of Object.getOwnPropertyNames(current)) {
      if (name === 'constructor' || seen.has(name)) {
        continue
      }

      seen.add(name)

      // Read the descriptor rather than the property: a getter on the prototype
      // would otherwise run here, against the prototype itself.
      const value: unknown = Object.getOwnPropertyDescriptor(current, name)?.value

      if (typeof value === 'function') {
        methods.push([name, value as Method])
      }
    }

    current = Object.getPrototypeOf(current) as object | null ?? undefined
  }

  return methods
}

function isMiddleware (className: string, prototype: object): boolean {
  return className.endsWith(MIDDLEWARE_SUFFIX)
    && typeof (prototype as Record<string, unknown>)[MIDDLEWARE_METHOD] === 'function'
}

function isAppLayer (className: string): boolean {
  return APP_LAYER_SUFFIXES.some(suffix => className.endsWith(suffix))
}

/** An enhancer may be registered as a class or as an instance. */
function prototypeOf (value: unknown): object | null {
  if (typeof value === 'function') {
    return (value as { prototype?: object }).prototype ?? null
  }

  if (typeof value === 'object' && value !== null) {
    return Object.getPrototypeOf(value) as object | null
  }

  return null
}

function classNameOf (value: unknown): string | undefined {
  if (typeof value === 'function') {
    return value.name
  }

  return (value as object | null)?.constructor?.name
}

// ---------------------------------------------------------------------------
// Wrapping: how to wrap.
// ---------------------------------------------------------------------------

/**
 * Replaces `target.methodName` on the prototype with a span-wrapped version.
 * Returns false when there was nothing to wrap, or it was wrapped already.
 */
function traceMethod (target: TraceTarget): boolean {
  const { prototype, methodName } = target
  const own = Object.getOwnPropertyDescriptor(prototype, methodName)
  // A guard may inherit `canActivate` from a base class rather than declaring
  // it. Read through the chain, then define the wrapper as an own property so
  // only this subclass is affected.
  const original = (own?.value ?? (prototype as Record<string, unknown>)[methodName]) as Method | undefined

  if (typeof original !== 'function' || own?.writable === false || isTraced(original)) {
    return false
  }

  const traced = makeTraced(original, target)

  Object.defineProperty(traced, 'name', { value: original.name })
  Object.defineProperty(traced, WRAPPED, { value: true })

  try {
    Object.defineProperty(prototype, methodName, {
      configurable: true,
      enumerable: own?.enumerable ?? false,
      writable: true,
      value: traced
    })
  } catch {
    return false
  }

  return true
}

function isTraced (method: Method): boolean {
  return (method as unknown as Record<symbol, unknown>)[WRAPPED] === true
}

function makeTraced (original: Method, target: TraceTarget): Method {
  const { spanName, attributes, isMiddleware = false } = target

  return function traced (this: unknown, ...args: unknown[]): unknown {
    const parentContext = isMiddleware ? context.active() : undefined

    return getOtelTracer().startActiveSpan(spanName, { attributes }, (span: Span) => {
      const end = endOnce(span)
      const callArgs = parentContext === undefined
        ? args
        : withTracedNext(args, end, parentContext)

      let result: unknown

      try {
        result = original.apply(this, callArgs)
      } catch (error) {
        failSpan(span, error)
        end()

        throw error
      }

      return settle(span, end, result, isMiddleware)
    })
  }
}

/** Ends the span once the returned value has finished its work, not when it is handed back. */
function settle (span: Span, end: () => void, result: unknown, isMiddleware: boolean): unknown {
  // Interceptors return an Observable whose work happens after `intercept`
  // returns; ending the span here would report near-zero durations. A middleware
  // span has already closed at `next()`, so it never follows one.
  if (!isMiddleware && isObservableLike(result)) {
    return endWithObservable(span, end, result)
  }

  if (!isPromiseLike(result)) {
    end()

    return result
  }

  return result.then(
    (value) => {
      // `async intercept()` resolves to the Observable that carries the rest of
      // the request, so the span must follow that, not the promise.
      if (!isMiddleware && isObservableLike(value)) {
        return endWithObservable(span, end, value)
      }

      end()

      return value
    },
    (error: unknown) => {
      failSpan(span, error)
      end()

      throw error
    }
  )
}

/**
 * Nest middleware hand control on by calling `next()`, then return. Ending the
 * span on return makes the rest of the chain outlive its own parent, and leaving
 * the span active makes sequential middleware look nested. So the span closes
 * when control is passed on, and the downstream runs in the context the
 * middleware was entered with — siblings, each timing its own work.
 */
function withTracedNext (args: unknown[], end: () => void, parentContext: Context): unknown[] {
  const next = args[NEXT_ARGUMENT_INDEX]

  if (typeof next !== 'function') {
    return args
  }

  const traced = [...args]

  traced[NEXT_ARGUMENT_INDEX] = (...nextArgs: unknown[]): unknown => {
    end()

    return context.with(parentContext, () => (next as Method)(...nextArgs))
  }

  return traced
}

function endOnce (span: Span): () => void {
  let ended = false

  return () => {
    if (!ended) {
      ended = true
      span.end()
    }
  }
}

function endWithObservable (
  span: Span,
  end: () => void,
  source: Observable<unknown>
): Observable<unknown> {
  return source.pipe(
    catchError((error: unknown) => {
      failSpan(span, error)

      return throwError(() => error)
    }),
    finalize(end)
  )
}

function failSpan (span: Span, error: unknown): void {
  span.setStatus({
    code: SpanStatusCode.ERROR,
    message: error instanceof Error ? error.message : String(error)
  })

  if (error instanceof Error) {
    span.recordException(error)
  }
}

/**
 * Duck-typed rather than using rxjs's `isObservable`, which is an instanceof
 * check: the application resolves its own copy of rxjs, so an Observable it
 * created never matches the class this package imported.
 */
function isObservableLike (value: unknown): value is Observable<unknown> {
  const candidate = value as Observable<unknown> | undefined

  return typeof candidate?.subscribe === 'function' && typeof candidate?.pipe === 'function'
}

function isPromiseLike (value: unknown): value is Promise<unknown> {
  return typeof (value as Promise<unknown> | undefined)?.then === 'function'
}
