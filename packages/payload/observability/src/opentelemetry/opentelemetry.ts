import { OTLPTraceExporter } from '@opentelemetry/exporter-trace-otlp-http'
import { HttpInstrumentation } from '@opentelemetry/instrumentation-http'
import { PgInstrumentation } from '@opentelemetry/instrumentation-pg'
import {
  defaultResource,
  resourceFromAttributes,
} from '@opentelemetry/resources'
import { NodeSDK } from '@opentelemetry/sdk-node'
import { ATTR_SERVICE_NAME } from '@opentelemetry/semantic-conventions'
import { ORPCInstrumentation } from '@orpc/otel'

export interface InitializeOpenTelemetryOptions {
  environment?: string
  serviceName: string
}

let sdk: NodeSDK | undefined

function isTracingConfigured(): boolean {
  return process.env.OTEL_EXPORTER_OTLP_TRACES_ENDPOINT != null
    || process.env.OTEL_EXPORTER_OTLP_ENDPOINT != null
}

/** Start server-side tracing when an OTLP endpoint is configured. */
export function initializeOpenTelemetry({
  environment, serviceName,
}: InitializeOpenTelemetryOptions): void {
  if (sdk != null || !isTracingConfigured()) {
    return
  }

  const resolvedServiceName = process.env.OTEL_SERVICE_NAME || serviceName
  const resource = defaultResource().merge(resourceFromAttributes({
    [ATTR_SERVICE_NAME]: resolvedServiceName,
    'deployment.environment.name': environment,
  }))

  sdk = new NodeSDK({
    instrumentations: [
      new HttpInstrumentation(),
      new PgInstrumentation(),
      new ORPCInstrumentation(),
    ],
    resource,
    traceExporter: new OTLPTraceExporter(),
  })
  sdk.start()

  process.once('SIGTERM', () => void sdk?.shutdown())
  process.once('SIGINT', () => void sdk?.shutdown())
}
