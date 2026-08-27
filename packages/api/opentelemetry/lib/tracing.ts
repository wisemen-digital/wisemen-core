import { NodeSDK } from '@opentelemetry/sdk-node'
import { resourceFromAttributes } from '@opentelemetry/resources'
import { OTLPTraceExporter } from '@opentelemetry/exporter-trace-otlp-http'
import { BatchSpanProcessor, BufferConfig } from '@opentelemetry/sdk-trace-base'
import { FilteringSpanProcessor, SpanExportFilter } from './filtering-span-processor.js'
import { registerInstrumentation } from './register-instrumentation.js'
import { createOtelHeaders, OtelAuth } from './headers.js'

export interface OpentelemetryTracingConfig {
  enabled: boolean
  serviceName: string
  auth?: OtelAuth
  url?: string
  env?: string
  buffer?: BufferConfig
  attributes?: Record<string, string>
  /** Return false to prevent a completed span from being queued for export. */
  shouldExportSpan?: SpanExportFilter
}


export function startOpentelemetryTracing (config: OpentelemetryTracingConfig): void {
  if (!config.enabled) {
    return
  }

  if (config.url == null || config.url === '') {
    return
  }

  registerInstrumentation()

  const traceExporter = new OTLPTraceExporter({
    url: config.url,
    headers: createOtelHeaders(config.auth)
  })

  const batchSpanProcessor = new BatchSpanProcessor(traceExporter, {
    maxQueueSize: config.buffer?.maxQueueSize ?? 2048,
    scheduledDelayMillis: config.buffer?.scheduledDelayMillis ?? 5000,
    exportTimeoutMillis: config.buffer?.exportTimeoutMillis ?? 30000,
    maxExportBatchSize: config.buffer?.maxExportBatchSize ?? 512
  })

  const spanProcessor = config.shouldExportSpan == null
    ? batchSpanProcessor
    : new FilteringSpanProcessor(batchSpanProcessor, config.shouldExportSpan)

  const sdk = new NodeSDK({
    traceExporter,
    autoDetectResources: false,
    spanProcessors: [
      spanProcessor,
    ],
    resource: resourceFromAttributes({
      'service.name': config.serviceName,
      'deployment.environment': config.env,
      ...config.attributes
    })
  })

  sdk.start()
}

