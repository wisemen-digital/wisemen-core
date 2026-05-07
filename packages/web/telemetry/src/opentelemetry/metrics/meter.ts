/* eslint-disable no-console */

import { metrics } from '@opentelemetry/api'
import { OTLPMetricExporter } from '@opentelemetry/exporter-metrics-otlp-proto'
import {
  MeterProvider,
  PeriodicExportingMetricReader,
} from '@opentelemetry/sdk-metrics'

import {
  createTelemetryHeaders,
  createTelemetryResource,
} from '@/opentelemetry/shared.ts'
import type { TelemetryOptions } from '@/types.ts'

export function initOpenTelemetryMetrics(
  options: TelemetryOptions,
): Promise<boolean> {
  if (options.enabled === false) {
    if (options.debug) {
      console.warn('[Telemetry] OpenTelemetry metrics are disabled.')
    }

    return Promise.resolve(false)
  }

  if (options.metricsEndpoint == null || options.metricsEndpoint === '') {
    if (options.debug) {
      console.warn('[Telemetry] OpenTelemetry metrics skipped: no metrics endpoint configured.')
    }

    return Promise.resolve(false)
  }

  const metricExporter = new OTLPMetricExporter({
    headers: (): Promise<Record<string, string>> => {
      return createTelemetryHeaders(options)
    },
    url: options.metricsEndpoint,
  })

  const metricReader = new PeriodicExportingMetricReader({
    exporter: metricExporter,
    exportIntervalMillis: 30_000,
    exportTimeoutMillis: 10_000,
  })

  const meterProvider = new MeterProvider({
    readers: [
      metricReader,
    ],
    resource: createTelemetryResource(options),
  })

  metrics.setGlobalMeterProvider(meterProvider)

  if (options.debug) {
    console.log('[Telemetry] OpenTelemetry metrics initialized.')
  }

  return Promise.resolve(true)
}
