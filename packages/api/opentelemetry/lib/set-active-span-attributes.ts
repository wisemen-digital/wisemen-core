import { Attributes, context, trace } from '@opentelemetry/api'

export function setActiveSpanAttributes(attributes: Attributes): void {
  trace.getSpan(context.active())?.setAttributes(attributes)
}