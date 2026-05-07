/* eslint-disable no-console */

import { ZoneContextManager } from '@opentelemetry/context-zone'
import { OTLPTraceExporter } from '@opentelemetry/exporter-trace-otlp-http'
import {
  BatchSpanProcessor,
  WebTracerProvider,
} from '@opentelemetry/sdk-trace-web'

import {
  createTelemetryHeaders,
  createTelemetryResource,
} from '@/opentelemetry/shared.ts'
import type { TelemetryOptions } from '@/types.ts'

export function initOpenTelemetryTracing(
  options: TelemetryOptions,
): Promise<boolean> {
  if (options.enabled === false) {
    if (options.debug) {
      console.warn('[Telemetry] OpenTelemetry tracing is disabled.')
    }

    return Promise.resolve(false)
  }

  if (options.traceEndpoint == null || options.traceEndpoint === '') {
    if (options.debug) {
      console.warn('[Telemetry] OpenTelemetry tracing skipped: no trace endpoint configured.')
    }

    return Promise.resolve(false)
  }

  const traceExporter = new OTLPTraceExporter({
    headers: (): Promise<Record<string, string>> => {
      return createTelemetryHeaders(options)
    },
    url: options.traceEndpoint,
  })

  const tracerProvider = new WebTracerProvider({
    resource: createTelemetryResource(options),
    spanProcessors: [
      new BatchSpanProcessor(traceExporter),
    ],
  })

  tracerProvider.register({
    contextManager: new ZoneContextManager(),
  })

  if (options.debug) {
    console.log('[Telemetry] OpenTelemetry tracing initialized.')
  }

  return Promise.resolve(true)
}
