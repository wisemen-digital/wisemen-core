import { NodeSDK } from '@opentelemetry/sdk-node'
import { resourceFromAttributes } from '@opentelemetry/resources'
import { OTLPTraceExporter } from '@opentelemetry/exporter-trace-otlp-http'
import { BatchSpanProcessor, BufferConfig, SpanProcessor } from '@opentelemetry/sdk-trace-base'
import { FilteringSpanProcessor, SpanExportFilter } from './filtering-span-processor.js'
import { isKnownNoiseSpan } from './noise-span-filter.js'
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
  /** Drop known no-information spans such as Redis keepalive pings. Defaults to true. */
  filterKnownNoiseSpans?: boolean
  /** Truncate span attribute values to this many characters. Defaults to 2048. */
  attributeValueLengthLimit?: number
}


// Bulk INSERT statements reach ~190 KB, which costs far more than it is worth.
const DEFAULT_ATTRIBUTE_VALUE_LENGTH_LIMIT = 2048

function buildSpanProcessor (
  batchSpanProcessor: BatchSpanProcessor,
  config: OpentelemetryTracingConfig
): SpanProcessor {
  const filters: SpanExportFilter[] = []

  if (config.filterKnownNoiseSpans ?? true) {
    filters.push(span => !isKnownNoiseSpan(span))
  }

  if (config.shouldExportSpan != null) {
    filters.push(config.shouldExportSpan)
  }

  if (filters.length === 0) {
    return batchSpanProcessor
  }

  return new FilteringSpanProcessor(
    batchSpanProcessor,
    span => filters.every(filter => filter(span))
  )
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

  const spanProcessor = buildSpanProcessor(batchSpanProcessor, config)

  const sdk = new NodeSDK({
    traceExporter,
    autoDetectResources: false,
    spanProcessors: [
      spanProcessor,
    ],
    spanLimits: {
      attributeValueLengthLimit: config.attributeValueLengthLimit ?? DEFAULT_ATTRIBUTE_VALUE_LENGTH_LIMIT
    },
    resource: resourceFromAttributes({
      'service.name': config.serviceName,
      'deployment.environment': config.env,
      ...config.attributes
    })
  })

  sdk.start()
}

