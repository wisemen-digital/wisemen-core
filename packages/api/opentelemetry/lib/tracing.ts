import { resourceFromAttributes } from '@opentelemetry/resources'
import { OTLPTraceExporter } from '@opentelemetry/exporter-trace-otlp-http'
import { BatchSpanProcessor, BufferConfig } from '@opentelemetry/sdk-trace-base'
import { NodeTracerProvider } from '@opentelemetry/sdk-trace-node'

export interface OpentelemetryTracingConfig {
  serviceName: string
  headers?: Record<string, string>
  url?: string
  env?: string
  buffer?: BufferConfig
  attributes?: Record<string, string>
}


class TracingSdk  {
  constructor (
    private readonly tracerProvider: NodeTracerProvider
  ) {}

  start (): void {
    this.tracerProvider.register()
  }

  shutdown (): Promise<void> {
    return this.tracerProvider.shutdown()
  }

  forceFlush (): Promise<void> {
    return this.tracerProvider.forceFlush()
  }
}

export function configureOpentelemetryTracing (
  config: OpentelemetryTracingConfig
): TracingSdk | null {
  if (config.url == null || config.url === '') {
    return null
  }

  const traceExporter = new OTLPTraceExporter({
    url: config.url,
    headers: config.headers
  })

  const tracerProvider = new NodeTracerProvider({
    spanProcessors: [
      new BatchSpanProcessor(traceExporter, {
        maxQueueSize: config.buffer?.maxQueueSize ?? 2048,
        scheduledDelayMillis: config.buffer?.scheduledDelayMillis ?? 5000,
        exportTimeoutMillis: config.buffer?.exportTimeoutMillis ?? 30000,
        maxExportBatchSize: config.buffer?.maxExportBatchSize ?? 512
      }),
    ],
    resource: resourceFromAttributes({
      'service.name': config.serviceName,
      'deployment.environment': config.env,
      ...config.attributes
    })
  })

  return new TracingSdk(tracerProvider)
}
