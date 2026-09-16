// src: https://github.com/amplication/opentelemetry-nestjs/blob/main/src/trace/instrumentation/guard.instrumentation.ts
import { context, SpanStatusCode, type Attributes, type Span } from '@opentelemetry/api'
import { catchError, finalize, throwError, type Observable } from 'rxjs'
import { getOtelTracer } from './get-otel-tracer.js'

// Nest's enhancer metadata keys. Inlined rather than imported: importing a
// runtime value from @nestjs/* would load a second copy of Nest into the
// process, and its class tokens would then never match the running app's.
const GUARDS_METADATA = '__guards__'
const INTERCEPTORS_METADATA = '__interceptors__'
const PIPES_METADATA = '__pipes__'
const EXCEPTION_FILTERS_METADATA = '__exceptionFilters__'

/** The parts of Nest's container this needs, passed in by the caller. */
export interface NestContainers {
  /** `app.get(ModulesContainer, { strict: false })` */
  modules: Iterable<{
    controllers: Map<unknown, { metatype?: unknown }>
    providers: Map<unknown, { metatype?: unknown }>
  }>
  /** `app.get(ApplicationConfig, { strict: false })` */
  config?: {
    getGlobalGuards: () => unknown[]
    getGlobalInterceptors: () => unknown[]
    getGlobalPipes: () => unknown[]
    getGlobalFilters: () => unknown[]
  }
}

const WRAPPED = Symbol('wisemen.traced')

/** The method each kind of Nest enhancer must implement. */
const ENHANCER_METHODS = {
  guard: 'canActivate',
  interceptor: 'intercept',
  pipe: 'transform',
  filter: 'catch',
  middleware: 'use'
} as const

const HANDLER_ENHANCERS = [
  { metadata: GUARDS_METADATA, method: ENHANCER_METHODS.guard },
  { metadata: INTERCEPTORS_METADATA, method: ENHANCER_METHODS.interceptor },
  { metadata: PIPES_METADATA, method: ENHANCER_METHODS.pipe },
  { metadata: EXCEPTION_FILTERS_METADATA, method: ENHANCER_METHODS.filter }
]

const APP_LAYER_SUFFIXES = ['UseCase', 'Repository']

export interface TraceAllNestLayersOptions {
  /** Guards, interceptors, pipes and exception filters. Default true. */
  enhancers?: boolean
  /** Nest middleware classes, so they no longer collapse into one middie span. Default true. */
  middleware?: boolean
  /** Classes named *UseCase / *Repository. Default true. */
  appLayer?: boolean
}

/**
 * Wraps the Nest layers that no instrumentation covers, so a trace shows what
 * ran between the HTTP hook and the database.
 *
 * Discovery is driven by Nest's own metadata and by `ApplicationConfig`, never
 * by inspecting arbitrary providers: wrapping anything that merely looks like
 * an enhancer reaches proxy-backed providers and breaks the container.
 * Methods are replaced on `metatype.prototype`, so no live instance is touched.
 */
export function traceAllNestLayers (
  containers: NestContainers,
  options: TraceAllNestLayersOptions = {}
): string[] {
  const {
    enhancers = true,
    middleware = true,
    appLayer = true
  } = options

  const traced: string[] = []
  // `modules` may be a one-shot iterator; each pass needs its own walk.
  const resolved: NestContainers = { ...containers, modules: [...containers.modules] }

  if (enhancers) {
    traced.push(...traceGlobalEnhancers(resolved))
    traced.push(...traceHandlerEnhancers(resolved))
  }

  if (middleware || appLayer) {
    traced.push(...traceProviderClasses(resolved, { middleware, appLayer }))
  }

  return traced
}

/** Enhancers registered with APP_GUARD, APP_PIPE, APP_INTERCEPTOR, APP_FILTER. */
function traceGlobalEnhancers (containers: NestContainers): string[] {
  const config = containers.config

  if (config == null) {
    return []
  }

  const groups: Array<[unknown[], string]> = [
    [config.getGlobalGuards(), ENHANCER_METHODS.guard],
    [config.getGlobalInterceptors(), ENHANCER_METHODS.interceptor],
    [config.getGlobalPipes(), ENHANCER_METHODS.pipe],
    [config.getGlobalFilters(), ENHANCER_METHODS.filter]
  ]

  const traced: string[] = []

  for (const [instances, method] of groups) {
    for (const instance of instances) {
      const prototype = prototypeOf(instance)
      const className = (instance as object)?.constructor?.name

      if (prototype == null || className == null) {
        continue
      }

      if (traceMethod(prototype, method, `${className}.${method}`)) {
        traced.push(`${className}.${method}`)
      }
    }
  }

  return traced
}

/** Enhancers attached to a controller class or one of its handlers. */
function traceHandlerEnhancers (containers: NestContainers): string[] {
  const traced: string[] = []

  for (const module of containers.modules) {
    for (const controller of module.controllers.values()) {
      const metatype = controller.metatype as (new (...args: never[]) => unknown) | undefined

      if (typeof metatype !== 'function') {
        continue
      }

      const targets: object[] = [metatype]
      const controllerPrototype = metatype.prototype as object | undefined

      if (controllerPrototype != null) {
        for (const name of Object.getOwnPropertyNames(controllerPrototype)) {
          if (name === 'constructor') {
            continue
          }

          // Read the descriptor rather than the property: a getter on the
          // prototype would otherwise run here, against the prototype itself.
          const handler: unknown = Object.getOwnPropertyDescriptor(controllerPrototype, name)?.value

          if (typeof handler === 'function') {
            targets.push(handler)
          }
        }
      }

      for (const target of targets) {
        for (const { metadata, method } of HANDLER_ENHANCERS) {
          const attached = (Reflect.getMetadata(metadata, target) ?? []) as unknown[]

          for (const enhancer of attached) {
            const prototype = prototypeOf(enhancer)
            const className = prototypeClassName(enhancer)

            if (prototype == null || className == null) {
              continue
            }

            if (traceMethod(prototype, method, `${className}.${method}`, {
              'nestjs.type': kindOf(method),
              'nestjs.provider': className,
              'nestjs.scope': 'controller'
            })) {
              traced.push(`${className}.${method}`)
            }
          }
        }
      }
    }
  }

  return traced
}

/** Middleware and conventionally-named application classes. */
function traceProviderClasses (
  containers: NestContainers,
  options: { middleware: boolean, appLayer: boolean }
): string[] {
  const traced: string[] = []

  for (const module of containers.modules) {
    for (const provider of module.providers.values()) {
      const metatype = provider.metatype as (new (...args: never[]) => unknown) | undefined
      const prototype = typeof metatype === 'function'
        ? metatype.prototype as object | undefined
        : undefined
      const className = metatype?.name

      if (prototype == null || className == null) {
        continue
      }

      const isMiddleware = className.endsWith('Middleware')
        && typeof (prototype as Record<string, unknown>).use === 'function'
      const isAppLayer = APP_LAYER_SUFFIXES.some(suffix => className.endsWith(suffix))

      if (isMiddleware && options.middleware) {
        if (traceMethod(prototype, ENHANCER_METHODS.middleware, `${className}.use`, {
          'nestjs.type': 'middleware',
          'nestjs.provider': className
        }, makeMiddlewareTraced)) {
          traced.push(`${className}.use`)
        }

        continue
      }

      if (!isAppLayer || !options.appLayer) {
        continue
      }

      for (const methodName of publicMethods(prototype)) {
        if (traceMethod(prototype, methodName, `${className}.${methodName}`, {
          'nestjs.type': 'application',
          'nestjs.provider': className
        })) {
          traced.push(`${className}.${methodName}`)
        }
      }
    }
  }

  return traced
}

function publicMethods (prototype: object): string[] {
  return Object.getOwnPropertyNames(prototype).filter((name) => {
    if (name === 'constructor' || name.startsWith('_')) {
      return false
    }

    const descriptor = Object.getOwnPropertyDescriptor(prototype, name)

    return typeof descriptor?.value === 'function'
  })
}

function prototypeOf (value: unknown): object | null {
  if (typeof value === 'function') {
    return (value as { prototype?: object }).prototype ?? null
  }

  if (typeof value === 'object' && value !== null) {
    return Object.getPrototypeOf(value) as object | null
  }

  return null
}

function prototypeClassName (value: unknown): string | undefined {
  if (typeof value === 'function') {
    return value.name
  }

  return (value as object | null)?.constructor?.name
}

function kindOf (method: string): string {
  const entry = Object.entries(ENHANCER_METHODS).find(([, value]) => value === method)

  return entry?.[0] ?? 'application'
}

type TracedFactory = (
  original: (...args: unknown[]) => unknown,
  spanName: string,
  attributes: Attributes
) => (this: unknown, ...args: unknown[]) => unknown

function traceMethod (
  prototype: object,
  methodName: string,
  spanName: string,
  attributes: Attributes = {},
  makeTraced: TracedFactory = makeStandardTraced
): boolean {
  const own = Object.getOwnPropertyDescriptor(prototype, methodName)
  // A guard may inherit `canActivate` from a base class rather than declaring
  // it. Read through the chain, then define the wrapper as an own property so
  // only this subclass is affected.
  const original = (own?.value ?? (prototype as Record<string, unknown>)[methodName]) as
    ((...args: unknown[]) => unknown) | undefined

  if (typeof original !== 'function' || own?.writable === false
    || (original as unknown as Record<symbol, unknown>)[WRAPPED] === true) {
    return false
  }

  const traced = makeTraced(original, spanName, attributes)

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

/**
 * Nest middleware hand control on by calling `next()`, then return. Ending the
 * span on return makes the rest of the chain outlive its own parent, and
 * leaving the span active makes sequential middleware look nested. So the span
 * closes when control is passed on, and the downstream runs in the context the
 * middleware was entered with — siblings, each timing its own work.
 */
function makeMiddlewareTraced (
  original: (...args: unknown[]) => unknown,
  spanName: string,
  attributes: Attributes
): (this: unknown, ...args: unknown[]) => unknown {
  return function traced (this: unknown, ...args: unknown[]): unknown {
    const parentContext = context.active()

    return getOtelTracer().startActiveSpan(spanName, { attributes }, (span: Span) => {
      let ended = false
      const end = (): void => {
        if (!ended) {
          ended = true
          span.end()
        }
      }

      const next = args[2]
      const handOver = typeof next === 'function'
        ? (...nextArgs: unknown[]): unknown => {
            end()

            return context.with(parentContext, () => (next as (...a: unknown[]) => unknown)(...nextArgs))
          }
        : next

      const forwarded = [...args]

      if (typeof next === 'function') {
        forwarded[2] = handOver
      }

      let result: unknown

      try {
        result = original.apply(this, forwarded)
      } catch (error) {
        failSpan(span, error)
        end()

        throw error
      }

      if (!isPromiseLike(result)) {
        end()

        return result
      }

      return result.then(
        (value) => {
          end()

          return value
        },
        (error: unknown) => {
          failSpan(span, error)
          end()

          throw error
        }
      )
    })
  }
}

function makeStandardTraced (
  original: (...args: unknown[]) => unknown,
  spanName: string,
  attributes: Attributes
): (this: unknown, ...args: unknown[]) => unknown {
  return function traced (this: unknown, ...args: unknown[]): unknown {
    return getOtelTracer().startActiveSpan(spanName, { attributes }, (span: Span) => {
      let result: unknown

      try {
        result = original.apply(this, args)
      } catch (error) {
        failSpan(span, error)
        span.end()

        throw error
      }

      // Interceptors return an Observable whose work happens after `intercept`
      // returns; ending the span here would report near-zero durations.
      if (isObservableLike(result)) {
        return endWithObservable(span, result)
      }

      if (!isPromiseLike(result)) {
        span.end()

        return result
      }

      return result.then(
        (value) => {
          // `async intercept()` resolves to the Observable that carries the
          // rest of the request, so the span must follow that, not the promise.
          if (isObservableLike(value)) {
            return endWithObservable(span, value)
          }

          span.end()

          return value
        },
        (error: unknown) => {
          failSpan(span, error)
          span.end()

          throw error
        }
      )
    })
  }
}


/** Ends the span when the observable completes, not when it is handed back. */
function endWithObservable (span: Span, source: Observable<unknown>): Observable<unknown> {
  return source.pipe(
    catchError((error: unknown) => {
      failSpan(span, error)

      return throwError(() => error)
    }),
    finalize(() => {
      span.end()
    })
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
