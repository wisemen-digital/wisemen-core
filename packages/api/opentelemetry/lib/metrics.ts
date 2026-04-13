import { OTLPMetricExporter } from '@opentelemetry/exporter-metrics-otlp-proto'
import { resourceFromAttributes } from '@opentelemetry/resources'
import { PeriodicExportingMetricReader } from '@opentelemetry/sdk-metrics'
import { NodeSDK } from '@opentelemetry/sdk-node'

export interface OpentelemetryMetricsConfig {
  serviceName: string
  headers?: Record<string, string>
  url?: string
  env?: string
  config?: {
    exportIntervalMillis?: number
    exportTimeoutMillis?: number
  }
  attributes?: Record<string, string>
}

export function configureOpentelemetryMetrics (
  config: OpentelemetryMetricsConfig
): NodeSDK | null {
  if (config.url == null || config.url === '') {
    return null
  }

  const metricReader = new PeriodicExportingMetricReader({
    exporter: new OTLPMetricExporter({
      url: config.url,
      headers: config.headers
    }),
    exportIntervalMillis: config.config?.exportIntervalMillis ?? 30000,
    exportTimeoutMillis: config.config?.exportTimeoutMillis ?? 10000
  })

  return new NodeSDK({
    resource: resourceFromAttributes({
      'service.name': config.serviceName,
      'deployment.environment': config.env,
      ...config.attributes
    }),
    metricReader
  })
}
