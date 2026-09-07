import { type Context, diag } from '@opentelemetry/api'
import type { ReadableSpan, Span, SpanProcessor } from '@opentelemetry/sdk-trace-base'

export type SpanExportFilter = (span: ReadableSpan) => boolean

export class FilteringSpanProcessor implements SpanProcessor {
  constructor (
    private readonly spanProcessor: SpanProcessor,
    private readonly shouldExportSpan: SpanExportFilter
  ) {}

  forceFlush (): Promise<void> {
    return this.spanProcessor.forceFlush()
  }

  onStart (span: Span, parentContext: Context): void {
    this.spanProcessor.onStart(span, parentContext)
  }

  onEnding (span: Span): void {
    this.spanProcessor.onEnding?.(span)
  }

  onEnd (span: ReadableSpan): void {
    try {
      if (this.shouldExportSpan(span)) {
        this.spanProcessor.onEnd(span)
      }
    }
    catch (error) {
      diag.error('Failed to filter OpenTelemetry span; exporting it instead.', error)
      this.spanProcessor.onEnd(span)
    }
  }

  shutdown (): Promise<void> {
    return this.spanProcessor.shutdown()
  }
}
