import assert from 'node:assert/strict'
import { before, beforeEach, describe, it } from 'node:test'
import {
  context,
  ROOT_CONTEXT,
  SpanStatusCode,
  trace,
  type Context,
  type ContextManager
} from '@opentelemetry/api'
import {
  BasicTracerProvider,
  InMemorySpanExporter,
  SimpleSpanProcessor,
  type ReadableSpan
} from '@opentelemetry/sdk-trace-base'
import { Observable, Subject } from 'rxjs'
import 'reflect-metadata'
import { traceAllNestLayers, type NestContainers } from '../trace-all-nest-layers.js'

const exporter = new InMemorySpanExporter()

/** Enough context propagation to assert parenting in synchronous code. */
class SyncContextManager implements ContextManager {
  private current: Context = ROOT_CONTEXT

  active (): Context {
    return this.current
  }

  with<A extends unknown[], F extends (...args: A) => ReturnType<F>>(
    ctx: Context,
    fn: F,
    thisArg?: ThisParameterType<F>,
    ...args: A
  ): ReturnType<F> {
    const previous = this.current
    this.current = ctx

    try {
      return fn.call(thisArg as ThisParameterType<F>, ...args)
    } finally {
      this.current = previous
    }
  }

  bind<T>(ctx: Context, target: T): T {
    if (typeof target !== 'function') {
      return target
    }

    const bound = (...args: unknown[]): unknown =>
      this.with(ctx, () => (target as (...a: unknown[]) => unknown)(...args))

    return bound as T
  }

  enable (): this {
    return this
  }

  disable (): this {
    return this
  }
}

class AuthGuard {
  canActivate (): boolean {
    return true
  }
}

class RolesGuard {
  canActivate (): boolean {
    return true
  }
}

class FailingGuard {
  canActivate (): boolean {
    throw new Error('nope')
  }
}

class LoggingInterceptor {
  intercept (_ctx: unknown, next: { handle: () => Observable<unknown> }): Observable<unknown> {
    return next.handle()
  }
}

class TenantMiddleware {
  use (_req: unknown, _res: unknown, next: () => void): void {
    next()
  }
}

class GetUserUseCase {
  execute (): string {
    return 'user'
  }

  _internal (): void {}
}

abstract class BaseRepository {
  countAll (): number {
    return 99
  }
}

class UserRepository extends BaseRepository {
  findById (): number {
    return 1
  }
}

class FactoryMadeUseCase {
  run (): string {
    return 'ran'
  }
}

class PlainService {
  doThing (): void {}
}

class UserController {
  findOne (): void {}
}

function buildContainers (): NestContainers {
  return {
    modules: [{
      controllers: new Map<unknown, { metatype?: unknown, instance?: unknown }>([
        [UserController, { metatype: UserController }]
      ]),
      providers: new Map<unknown, { metatype?: unknown, instance?: unknown }>([
        [TenantMiddleware, { metatype: TenantMiddleware }],
        [GetUserUseCase, { metatype: GetUserUseCase }],
        [UserRepository, { metatype: UserRepository }],
        [PlainService, { metatype: PlainService }],
        [LoggingInterceptor, { metatype: LoggingInterceptor }],
        // useFactory providers carry no usable metatype, only a built instance.
        ['factory-made', { instance: new FactoryMadeUseCase() }]
      ]),
    }],
    config: {
      getGlobalGuards: () => [new AuthGuard()],
      getGlobalInterceptors: () => [],
      getGlobalPipes: () => [],
      getGlobalFilters: () => []
    }
  }
}

function finished (): ReadableSpan[] {
  return exporter.getFinishedSpans()
}

function spanNamed (name: string): ReadableSpan {
  const span = finished().find(candidate => candidate.name === name)

  assert.ok(span != null, `expected a span named ${name}, got ${finished().map(s => s.name).join(', ')}`)

  return span
}

describe('traceAllNestLayers', () => {
  before(() => {
    context.setGlobalContextManager(new SyncContextManager())
    trace.setGlobalTracerProvider(new BasicTracerProvider({
      spanProcessors: [new SimpleSpanProcessor(exporter)]
    }))

    // Guards attached to the controller class and to one of its handlers.
    Reflect.defineMetadata('__guards__', [RolesGuard], UserController)
    Reflect.defineMetadata('__interceptors__', [LoggingInterceptor], UserController.prototype.findOne)

    traceAllNestLayers(buildContainers())
  })

  beforeEach(() => {
    exporter.reset()
  })

  it('wraps exactly the discovered layers, and nothing else', () => {
    const traced = traceAllNestLayers(buildContainers())

    // Everything is already wrapped, so a second pass must be a no-op.
    assert.deepEqual(traced, [])

    assert.equal(typeof PlainService.prototype.doThing, 'function')
    new PlainService().doThing()
    assert.deepEqual(finished().map(span => span.name), [])
  })

  it('names global enhancer spans without nestjs attributes, as before', () => {
    new AuthGuard().canActivate()

    const span = spanNamed('AuthGuard.canActivate')

    assert.deepEqual(span.attributes, {})
  })

  it('tags controller-scoped enhancers', () => {
    new RolesGuard().canActivate()

    assert.deepEqual(spanNamed('RolesGuard.canActivate').attributes, {
      'nestjs.type': 'guard',
      'nestjs.provider': 'RolesGuard',
      'nestjs.scope': 'controller'
    })
  })

  it('traces public use case and repository methods, skipping underscored ones', () => {
    const useCase = new GetUserUseCase()

    assert.equal(useCase.execute(), 'user')
    useCase._internal()
    assert.equal(new UserRepository().findById(), 1)

    assert.deepEqual(finished().map(span => span.name).sort(), [
      'GetUserUseCase.execute',
      'UserRepository.findById'
    ])
    assert.deepEqual(spanNamed('GetUserUseCase.execute').attributes, {
      'nestjs.type': 'application',
      'nestjs.provider': 'GetUserUseCase'
    })
  })

  it('keeps an interceptor span open until its observable completes', () => {
    const subject = new Subject<string>()
    const result = new LoggingInterceptor().intercept(null, { handle: () => subject.asObservable() })

    result.subscribe()

    assert.deepEqual(finished().map(span => span.name), [], 'span ended before the observable did')

    subject.next('done')
    subject.complete()

    assert.deepEqual(finished().map(span => span.name), ['LoggingInterceptor.intercept'])
  })

  it('closes a middleware span at next(), so downstream work is a sibling', () => {
    let spanIdAtNext: string | undefined

    new TenantMiddleware().use(null, null, () => {
      spanIdAtNext = trace.getActiveSpan()?.spanContext().spanId

      assert.deepEqual(
        finished().map(span => span.name),
        ['TenantMiddleware.use'],
        'middleware span should already be closed when next() runs'
      )
    })

    const span = spanNamed('TenantMiddleware.use')

    assert.deepEqual(span.attributes, {
      'nestjs.type': 'middleware',
      'nestjs.provider': 'TenantMiddleware'
    })
    // next() runs in the context the middleware was entered with, not inside its span.
    assert.notEqual(spanIdAtNext, span.spanContext().spanId)
  })

  it('records the error and rethrows when a layer throws', () => {
    traceAllNestLayers({
      modules: [],
      config: {
        getGlobalGuards: () => [new FailingGuard()],
        getGlobalInterceptors: () => [],
        getGlobalPipes: () => [],
        getGlobalFilters: () => []
      }
    })

    assert.throws(() => new FailingGuard().canActivate(), /nope/)

    const span = spanNamed('FailingGuard.canActivate')

    assert.equal(span.status.code, SpanStatusCode.ERROR)
    assert.equal(span.status.message, 'nope')
    assert.equal(span.events[0]?.name, 'exception')
  })

  it('traces methods inherited from a base class', () => {
    assert.equal(new UserRepository().countAll(), 99)

    assert.deepEqual(spanNamed('UserRepository.countAll').attributes, {
      'nestjs.type': 'application',
      'nestjs.provider': 'UserRepository'
    })
  })

  it('traces a use case provided by useFactory, via its instance', () => {
    assert.equal(new FactoryMadeUseCase().run(), 'ran')

    assert.deepEqual(spanNamed('FactoryMadeUseCase.run').attributes, {
      'nestjs.type': 'application',
      'nestjs.provider': 'FactoryMadeUseCase'
    })
  })

  it('preserves the original method name', () => {
    assert.equal(GetUserUseCase.prototype.execute.name, 'execute')
    assert.equal(TenantMiddleware.prototype.use.name, 'use')
  })
})
