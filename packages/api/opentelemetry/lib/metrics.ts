import { OTLPMetricExporter } from '@opentelemetry/exporter-metrics-otlp-proto'
import { metrics } from '@opentelemetry/api'
import { resourceFromAttributes } from '@opentelemetry/resources'
import { MeterProvider, PeriodicExportingMetricReader } from '@opentelemetry/sdk-metrics'

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

export interface OpentelemetryMetricsSdk {
  start(): void
  shutdown(): Promise<void>
  forceFlush(): Promise<void>
}

class MetricsSdk implements OpentelemetryMetricsSdk {
  constructor (
    private readonly meterProvider: MeterProvider
  ) {}

  start (): void {
    metrics.setGlobalMeterProvider(this.meterProvider)
  }

  shutdown (): Promise<void> {
    return this.meterProvider.shutdown()
  }

  forceFlush (): Promise<void> {
    return this.meterProvider.forceFlush()
  }
}

export function configureOpentelemetryMetrics (
  config: OpentelemetryMetricsConfig
): OpentelemetryMetricsSdk | null {
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

  const meterProvider = new MeterProvider({
    resource: resourceFromAttributes({
      'service.name': config.serviceName,
      'deployment.environment': config.env,
      ...config.attributes
    }),
    readers: [metricReader]
  })

  return new MetricsSdk(meterProvider)
}
