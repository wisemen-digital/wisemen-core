import assert from 'node:assert/strict'
import { context, SpanStatusCode, type Context } from '@opentelemetry/api'
import type { Attributes } from '@opentelemetry/api'
import type { ReadableSpan, Span, SpanProcessor } from '@opentelemetry/sdk-trace-base'
import { describe, it } from 'node:test'
import { FilteringSpanProcessor } from '../filtering-span-processor.js'
import { TraceVolumeReductionSpanProcessor } from '../trace-volume-reduction-span-processor.js'

class RecordingSpanProcessor implements SpanProcessor {
  readonly endedSpans: ReadableSpan[] = []
  readonly endingSpans: Span[] = []
  readonly startedSpans: Span[] = []
  forceFlushCount = 0
  shutdownCount = 0

  forceFlush (): Promise<void> {
    this.forceFlushCount++

    return Promise.resolve()
  }

  onStart (span: Span, _parentContext: Context): void {
    this.startedSpans.push(span)
  }

  onEnding (span: Span): void {
    this.endingSpans.push(span)
  }

  onEnd (span: ReadableSpan): void {
    this.endedSpans.push(span)
  }

  shutdown (): Promise<void> {
    this.shutdownCount++

    return Promise.resolve()
  }
}

function createSpan (options: {
  attributes?: Attributes
  durationMilliseconds?: number
  isError?: boolean
  scope?: string
} = {}): ReadableSpan {
  const durationMilliseconds = options.durationMilliseconds ?? 10

  return {
    attributes: options.attributes ?? {},
    duration: [Math.floor(durationMilliseconds / 1000), (durationMilliseconds % 1000) * 1_000_000],
    instrumentationScope: { name: options.scope ?? '@opentelemetry/instrumentation-pg' },
    status: { code: options.isError === true ? SpanStatusCode.ERROR : SpanStatusCode.UNSET }
  } as ReadableSpan
}

describe('TraceVolumeReductionSpanProcessor', () => {
  it('removes legacy and stable SQL text from PostgreSQL spans', () => {
    const delegate = new RecordingSpanProcessor()
    const processor = new TraceVolumeReductionSpanProcessor(delegate)
    const span = createSpan({
      attributes: {
        'db.statement': 'SELECT * FROM payment',
        'db.query.text': 'SELECT * FROM payment',
        'db.query.summary': 'SELECT payment'
      },
      durationMilliseconds: 499
    })

    processor.onEnd(span)

    assert.deepEqual(delegate.endedSpans, [span])
    assert.deepEqual(span.attributes, { 'db.query.summary': 'SELECT payment' })
  })

  it('removes SQL text from slow and failed PostgreSQL spans too', () => {
    const delegate = new RecordingSpanProcessor()
    const processor = new TraceVolumeReductionSpanProcessor(delegate)
    const slowSpan = createSpan({
      attributes: {
        'db.statement': 'SELECT * FROM payment',
        'db.query.summary': 'SELECT payment'
      },
      durationMilliseconds: 5000
    })
    const errorSpan = createSpan({
      attributes: {
        'db.query.text': 'SELECT * FROM payment',
        'db.query.summary': 'SELECT payment'
      },
      durationMilliseconds: 10,
      isError: true
    })

    processor.onEnd(slowSpan)
    processor.onEnd(errorSpan)

    assert.deepEqual(delegate.endedSpans, [slowSpan, errorSpan])
    assert.deepEqual(slowSpan.attributes, { 'db.query.summary': 'SELECT payment' })
    assert.deepEqual(errorSpan.attributes, { 'db.query.summary': 'SELECT payment' })
  })

  it('drops successful transaction-control spans from stable or legacy attributes', () => {
    const delegate = new RecordingSpanProcessor()
    const processor = new TraceVolumeReductionSpanProcessor(delegate)

    for (const operation of ['COMMIT', 'RELEASE', 'ROLLBACK', 'SAVEPOINT', 'START']) {
      processor.onEnd(createSpan({ attributes: { 'db.operation.name': operation.toLowerCase() } }))
    }
    processor.onEnd(createSpan({ attributes: { 'db.statement': '  SAVEPOINT before_payment' } }))
    processor.onEnd(createSpan({ attributes: { 'db.query.text': 'ROLLBACK;' } }))

    assert.deepEqual(delegate.endedSpans, [])
  })

  it('retains failed transaction-control spans without their SQL text', () => {
    const delegate = new RecordingSpanProcessor()
    const processor = new TraceVolumeReductionSpanProcessor(delegate)
    const span = createSpan({
      attributes: { 'db.statement': 'COMMIT', 'db.operation.name': 'COMMIT' },
      isError: true
    })

    processor.onEnd(span)

    assert.deepEqual(delegate.endedSpans, [span])
    assert.deepEqual(span.attributes, { 'db.operation.name': 'COMMIT' })
  })

  it('drops redis keepalive pings from any instrumentation scope', () => {
    const delegate = new RecordingSpanProcessor()
    const processor = new TraceVolumeReductionSpanProcessor(delegate)
    const keptSpan = createSpan({
      attributes: { 'db.statement': 'GET user-session', 'db.system': 'redis' },
      scope: '@opentelemetry/instrumentation-redis'
    })

    processor.onEnd(createSpan({
      attributes: { 'db.statement': 'PING ', 'db.system': 'redis' },
      scope: '@opentelemetry/instrumentation-redis'
    }))
    processor.onEnd(keptSpan)

    assert.deepEqual(delegate.endedSpans, [keptSpan])
  })

  it('does not change spans from other instrumentations', () => {
    const delegate = new RecordingSpanProcessor()
    const processor = new TraceVolumeReductionSpanProcessor(delegate)
    const span = createSpan({
      attributes: { 'db.statement': 'SELECT * FROM payment' },
      scope: 'custom-instrumentation'
    })

    processor.onEnd(span)

    assert.deepEqual(delegate.endedSpans, [span])
    assert.equal(span.attributes['db.statement'], 'SELECT * FROM payment')
  })

  it('reduces spans before applying the consumer export filter', () => {
    const delegate = new RecordingSpanProcessor()
    const filter = new FilteringSpanProcessor(
      delegate,
      span => span.attributes['db.statement'] === undefined
    )
    const processor = new TraceVolumeReductionSpanProcessor(filter)
    const span = createSpan({ attributes: { 'db.statement': 'SELECT * FROM payment' } })

    processor.onEnd(span)

    assert.deepEqual(delegate.endedSpans, [span])
  })

  it('fails open and forwards lifecycle calls', async () => {
    const delegate = new RecordingSpanProcessor()
    const processor = new TraceVolumeReductionSpanProcessor(delegate)
    const malformedSpan = {
      get instrumentationScope (): never {
        throw new Error('broken span')
      }
    } as unknown as ReadableSpan
    const span = {} as Span

    processor.onStart(span, context.active())
    processor.onEnding(span)
    processor.onEnd(malformedSpan)
    await processor.forceFlush()
    await processor.shutdown()

    assert.deepEqual(delegate.startedSpans, [span])
    assert.deepEqual(delegate.endingSpans, [span])
    assert.deepEqual(delegate.endedSpans, [malformedSpan])
    assert.equal(delegate.forceFlushCount, 1)
    assert.equal(delegate.shutdownCount, 1)
  })
})
