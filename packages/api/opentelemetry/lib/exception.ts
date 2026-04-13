import { trace, SpanStatusCode, Exception, Span } from '@opentelemetry/api'
import { getOtelTracer } from './index.js'

function setExceptionAttributes (span: Span, exception: unknown): void {
  span.recordException(exception as Exception)
  span.setAttribute('exceptions.captured', true)

  if (exception instanceof Error) {
    span.setAttribute('exceptions.message', exception.message)
    span.setAttribute('exceptions.stacktrace', exception.stack ?? '')

    const prototype = Object.getPrototypeOf(exception) as { constructor: { name: string } }
    const className = prototype.constructor.name as string | undefined

    span.setAttribute('exception.type', className ?? exception.name)
  }
}

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
