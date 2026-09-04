import type {
  AttributeValue,
  Attributes,
  Context,
  ContextManager,
  Exception,
  Link,
  Span,
  SpanContext,
  SpanStatus,
  TimeInput
} from '@opentelemetry/api'
import { ROOT_CONTEXT, SpanStatusCode, context, trace } from '@opentelemetry/api'
import { describe, it } from 'node:test'
import assert from 'node:assert'
import { captureException } from '../capture-exception.js'

/**
 * `context.with` is a no-op unless a ContextManager is registered, which would make every
 * assertion below pass vacuously against a span that was never touched. captureException is
 * synchronous, so a stack of one suffices.
 */
class SyncContextManager implements ContextManager {
  private current: Context = ROOT_CONTEXT

  active (): Context {
    return this.current
  }

  bind<T> (_context: Context, target: T): T {
    return target
  }

  disable (): this {
    return this
  }

  enable (): this {
    return this
  }

  with<A extends unknown[], F extends (...args: A) => ReturnType<F>> (
    ctx: Context,
    fn: F,
    thisArg?: ThisParameterType<F>,
    ...args: A
  ): ReturnType<F> {
    const previous = this.current

    this.current = ctx

    try {
      return fn.call(thisArg, ...args)
    } finally {
      this.current = previous
    }
  }
}

context.setGlobalContextManager(new SyncContextManager())

class RecordingSpan implements Span {
  readonly attributes: Record<string, AttributeValue | undefined> = {}
  readonly recordedExceptions: Exception[] = []
  status: SpanStatus | null = null

  addEvent (): this {
    return this
  }

  addLink (_link: Link): this {
    return this
  }

  addLinks (_links: Link[]): this {
    return this
  }

  end (_endTime?: TimeInput): void {}

  isRecording (): boolean {
    return true
  }

  recordException (exception: Exception, _time?: TimeInput): void {
    this.recordedExceptions.push(exception)
  }

  setAttribute (key: string, value: AttributeValue): this {
    this.attributes[key] = value

    return this
  }

  setAttributes (attributes: Attributes): this {
    Object.assign(this.attributes, attributes)

    return this
  }

  setStatus (status: SpanStatus): this {
    this.status = status

    return this
  }

  spanContext (): SpanContext {
    return { spanId: 'span', traceFlags: 1, traceId: 'trace' }
  }

  updateName (_name: string): this {
    return this
  }
}

function captureOn (exception: unknown): RecordingSpan {
  const span = new RecordingSpan()

  context.with(trace.setSpan(context.active(), span), () => {
    captureException(exception)
  })

  return span
}

describe('captureException', () => {
  it('uses the singular semantic-convention attribute names', () => {
    const span = captureOn(new Error('boom'))

    assert.strictEqual(span.attributes['exception.message'], 'boom')
    assert.ok(span.attributes['exception.stacktrace'] !== undefined)
  })

  it('never emits the legacy plural attribute names', () => {
    const span = captureOn(new Error('boom'))

    assert.strictEqual(span.attributes['exceptions.message'], undefined)
    assert.strictEqual(span.attributes['exceptions.stacktrace'], undefined)
  })

  it('records the exception and marks the span as errored', () => {
    const error = new Error('boom')
    const span = captureOn(error)

    assert.deepStrictEqual(span.recordedExceptions, [error])
    assert.strictEqual(span.status?.code, SpanStatusCode.ERROR)
  })

  it('reports the constructor name as exception.type', () => {
    class OrderRejectedError extends Error {}

    const span = captureOn(new OrderRejectedError('nope'))

    assert.strictEqual(span.attributes['exception.type'], 'OrderRejectedError')
  })

  it('prefers the class name over a `code` property', () => {
    class AxiosError extends Error {
      code = 'ERR_BAD_RESPONSE'
    }

    const span = captureOn(new AxiosError('request failed'))

    assert.strictEqual(span.attributes['exception.type'], 'AxiosError')
  })

  it('handles a thrown object that is not an Error', () => {
    const span = captureOn({ message: 'not an error' })

    assert.strictEqual(span.attributes['exception.message'], 'not an error')
    assert.strictEqual(span.attributes['exception.type'], 'object_error')
  })

  it('handles a thrown primitive', () => {
    const span = captureOn('just a string')

    assert.strictEqual(span.attributes['exception.type'], 'unknown_error')
  })
})
