/* eslint-disable no-console */

import { ZoneContextManager } from '@opentelemetry/context-zone'
import { OTLPTraceExporter } from '@opentelemetry/exporter-trace-otlp-http'
import {
  ParentBasedSampler,
  TraceIdRatioBasedSampler,
} from '@opentelemetry/sdk-trace-base'
import {
  BatchSpanProcessor,
  WebTracerProvider,
} from '@opentelemetry/sdk-trace-web'

import {
  createTelemetryHeaders,
  createTelemetryResource,
} from '@/opentelemetry/shared.ts'
import type { TelemetryOptions } from '@/types.ts'

const DEFAULT_TRACE_SAMPLE_RATE = 1

function resolveTraceSampleRate(options: TelemetryOptions): number {
  const traceSampleRate = options.traceSampleRate ?? DEFAULT_TRACE_SAMPLE_RATE

  if (traceSampleRate >= 0 && traceSampleRate <= 1) {
    return traceSampleRate
  }

  if (options.debug) {
    console.warn(`[Telemetry] Invalid traceSampleRate "${traceSampleRate}". Falling back to ${DEFAULT_TRACE_SAMPLE_RATE}.`)
  }

  return DEFAULT_TRACE_SAMPLE_RATE
}

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
    sampler: new ParentBasedSampler({
      root: new TraceIdRatioBasedSampler(resolveTraceSampleRate(options)),
    }),
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
