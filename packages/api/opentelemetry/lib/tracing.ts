import { NodeSDK } from '@opentelemetry/sdk-node'
import { resourceFromAttributes } from '@opentelemetry/resources'
import { OTLPTraceExporter } from '@opentelemetry/exporter-trace-otlp-http'
import { BatchSpanProcessor, BufferConfig } from '@opentelemetry/sdk-trace-base'
import { FilteringSpanProcessor, SpanExportFilter } from './filtering-span-processor.js'

export interface OpentelemetryTracingConfig {
  serviceName: string
  headers?: Record<string, string>
  url?: string
  env?: string
  buffer?: BufferConfig
  attributes?: Record<string, string>
  /** Return false to prevent a completed span from being queued for export. */
  shouldExportSpan?: SpanExportFilter
}

export function configureOpentelemetryTracing (config: OpentelemetryTracingConfig): NodeSDK | null {
  if (config.url == null || config.url === '') {
    return null
  }

  const traceExporter = new OTLPTraceExporter({
    url: config.url,
    headers: config.headers
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

  return sdk
}
