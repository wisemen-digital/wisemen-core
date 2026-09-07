import { context, type Context } from '@opentelemetry/api'
import type { ReadableSpan, Span, SpanProcessor } from '@opentelemetry/sdk-trace-base'
import { describe, it } from 'node:test'
import { FilteringSpanProcessor } from '../filtering-span-processor.js'
import assert from 'node:assert'

class SomeSpanProcessor implements SpanProcessor {
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

describe('FilteringSpanProcessor', () => {
  it('forwards spans accepted by the filter', () => {
    const delegate = new SomeSpanProcessor()
    const processor = new FilteringSpanProcessor(delegate, span => span.name !== '[Redis] PING')
    const span = { name: 'GET /users' } as ReadableSpan

    processor.onEnd(span)

    assert.deepEqual(delegate.endedSpans, [span])
  })

  it('does not forward spans rejected by the filter', () => {
    const delegate = new SomeSpanProcessor()
    const processor = new FilteringSpanProcessor(delegate, span => span.name !== '[Redis] PING')

    processor.onEnd({ name: '[Redis] PING' } as ReadableSpan)

    assert.deepEqual(delegate.endedSpans, [])
  })

  it('exports the span when the filter throws', () => {
    const delegate = new SomeSpanProcessor()
    const processor = new FilteringSpanProcessor(delegate, () => {
      throw new Error('Filter failed')
    })
    const span = { name: '[Redis] PING' } as ReadableSpan

    processor.onEnd(span)

    assert.deepEqual(delegate.endedSpans, [span])
  })

  it('forwards lifecycle calls to the wrapped processor', async () => {
    const delegate = new SomeSpanProcessor()
    const processor = new FilteringSpanProcessor(delegate, () => true)
    const span = {} as Span

    processor.onStart(span, context.active())
    processor.onEnding(span)
    await processor.forceFlush()
    await processor.shutdown()

    assert.deepEqual(delegate.startedSpans, [span])
    assert.deepEqual(delegate.endingSpans, [span])
    assert.equal(delegate.forceFlushCount, 1)
    assert.equal(delegate.shutdownCount, 1)
  })
})
