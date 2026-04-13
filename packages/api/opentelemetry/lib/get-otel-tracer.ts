import { trace, Tracer } from '@opentelemetry/api'
import { getOtelServiceName } from './get-otel-service-name.js'

export function getOtelTracer (serviceName: string = getOtelServiceName()): Tracer {
  return trace.getTracer(serviceName)
}
