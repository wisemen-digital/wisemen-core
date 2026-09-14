import {
  isSpanContextValid,
  trace,
} from '@opentelemetry/api'

/** Returns trace identifiers suitable for adding to structured log events. */
export function getActiveTraceLogContext(): Record<string, string> | undefined {
  const spanContext = trace.getActiveSpan()?.spanContext()

  if (spanContext == null || !isSpanContextValid(spanContext)) {
    return undefined
  }

  return {
    span_id: spanContext.spanId,
    trace_id: spanContext.traceId,
    trace_flags: spanContext.traceFlags.toString(16).padStart(2, '0'),
  }
}
