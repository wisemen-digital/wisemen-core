import { OTLPMetricExporter } from '@opentelemetry/exporter-metrics-otlp-proto'
import { resourceFromAttributes } from '@opentelemetry/resources'
import { PeriodicExportingMetricReader } from '@opentelemetry/sdk-metrics'
import { NodeSDK } from '@opentelemetry/sdk-node'
import { createOtelHeaders, OtelAuth } from './headers.js'

export interface OpentelemetryMetricsConfig {
  enabled: boolean,
  serviceName: string
  auth?: OtelAuth
  url?: string
  env?: string
  config?: {
    exportIntervalMillis?: number
    exportTimeoutMillis?: number
  }
  attributes?: Record<string, string>
}


export function startOpentelemetryMetrics (config: OpentelemetryMetricsConfig): void {
  if (!config.enabled) {
    return
  }

  if (config.url == null || config.url === '') {
    return
  }

  const metricReader = new PeriodicExportingMetricReader({
    exporter: new OTLPMetricExporter({
      url: config.url,
      headers: createOtelHeaders(config.auth)
    }),
    exportIntervalMillis: config.config?.exportIntervalMillis ?? 30000,
    exportTimeoutMillis: config.config?.exportTimeoutMillis ?? 10000
  })

  const sdk = new NodeSDK({
    resource: resourceFromAttributes({
      'service.name': config.serviceName,
      'deployment.environment': config.env,
      ...config.attributes
    }),
    metricReader
  })

  sdk.start()
}