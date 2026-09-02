import { trace, SpanStatusCode, Exception, Span } from '@opentelemetry/api'
import { getOtelTracer } from './index.js'

export function captureException (exception: unknown, message?: string): void {
  const activeSpan = trace.getActiveSpan()

  if (activeSpan == null) {
    const tracer = getOtelTracer()

    tracer.startActiveSpan('captureException', (span) => {
      span.setStatus({
        code: SpanStatusCode.ERROR,
        message: message
      })

      setExceptionAttributes(span, exception)
      span.end()
    })

    return
  }

  activeSpan.setStatus({
    code: SpanStatusCode.ERROR,
    message: message
  })

  setExceptionAttributes(activeSpan, exception)
}

function setExceptionAttributes (span: Span, exception: unknown): void {
  span.recordException(exception as Exception)

  if (exception instanceof Error) {
    span.setAttribute('exception.message', exception.message)
    span.setAttribute('exception.stacktrace', exception.stack ?? '')

    const prototype = Object.getPrototypeOf(exception) as { constructor: { name: string } }
    const className = prototype.constructor.name as string | undefined

    span.setAttribute('exception.type', className ?? exception.name ?? 'unknown')
  } else if (typeof exception === 'object' && exception !== null && 'message' in exception) {
    span.setAttribute('exception.message', String((exception as { message: string }).message))
    span.setAttribute('exception.type', 'object_error')
  } else {
    span.setAttribute('exception.type', 'unknown_error')
  }
}