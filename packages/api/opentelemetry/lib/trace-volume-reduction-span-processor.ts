import { type Context, diag, SpanStatusCode } from '@opentelemetry/api'
import type { Attributes } from '@opentelemetry/api'
import type { ReadableSpan, Span, SpanProcessor } from '@opentelemetry/sdk-trace-base'

const POSTGRES_INSTRUMENTATION_SCOPE = '@opentelemetry/instrumentation-pg'
const SLOW_QUERY_THRESHOLD_MILLISECONDS = 500
const SQL_ATTRIBUTE_NAMES = ['db.statement', 'db.query.text'] as const
const TRANSACTION_OPERATIONS = new Set([
  'COMMIT',
  'RELEASE',
  'ROLLBACK',
  'SAVEPOINT',
  'START'
])

export class TraceVolumeReductionSpanProcessor implements SpanProcessor {
  constructor (private readonly spanProcessor: SpanProcessor) {}

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
      if (!isPostgresSpan(span)) {
        this.spanProcessor.onEnd(span)

        return
      }

      const isError = span.status.code === SpanStatusCode.ERROR
      const operation = getOperation(span.attributes)

      if (!isError && operation !== undefined && TRANSACTION_OPERATIONS.has(operation)) {
        return
      }

      if (!isError && getDurationMilliseconds(span) < SLOW_QUERY_THRESHOLD_MILLISECONDS) {
        removeSqlText(span.attributes)
      }

      this.spanProcessor.onEnd(span)
    } catch (error) {
      diag.error('Failed to reduce OpenTelemetry span volume; exporting the span instead.', error)
      this.spanProcessor.onEnd(span)
    }
  }

  shutdown (): Promise<void> {
    return this.spanProcessor.shutdown()
  }
}

function getDurationMilliseconds (span: ReadableSpan): number {
  return span.duration[0] * 1000 + span.duration[1] / 1_000_000
}

function getOperation (attributes: Attributes): string | undefined {
  const operation = attributes['db.operation.name']

  if (typeof operation === 'string' && operation !== '') {
    return operation.trim().split(/\s/u, 1)[0]?.replace(/;$/u, '').toUpperCase()
  }

  for (const attributeName of SQL_ATTRIBUTE_NAMES) {
    const sql = attributes[attributeName]

    if (typeof sql === 'string') {
      return sql.trim().split(/\s/u, 1)[0]?.replace(/;$/u, '').toUpperCase()
    }
  }

  return undefined
}

function isPostgresSpan (span: ReadableSpan): boolean {
  return span.instrumentationScope.name === POSTGRES_INSTRUMENTATION_SCOPE
}

function removeSqlText (attributes: Attributes): void {
  for (const attributeName of SQL_ATTRIBUTE_NAMES) {
    delete attributes[attributeName]
  }
}
