/* eslint-disable no-console */

import type { Logger } from '@opentelemetry/api-logs'
import { OTLPLogExporter } from '@opentelemetry/exporter-logs-otlp-http'
import {
  BatchLogRecordProcessor,
  LoggerProvider,
} from '@opentelemetry/sdk-logs'

import {
  createTelemetryHeaders,
  createTelemetryResource,
} from '@/opentelemetry/shared.ts'
import type { TelemetryOptions } from '@/types.ts'

export function initOpenTelemetryLogging(
  options: TelemetryOptions,
): Promise<Logger | null> {
  if (options.enabled === false) {
    if (options.debug) {
      console.warn('[Telemetry] OpenTelemetry logging is disabled.')
    }

    return Promise.resolve(null)
  }

  if (options.logEndpoint == null || options.logEndpoint === '') {
    if (options.debug) {
      console.warn('[Telemetry] OpenTelemetry logging skipped: no log endpoint configured.')
    }

    return Promise.resolve(null)
  }

  const logExporter = new OTLPLogExporter({
    headers: (): Promise<Record<string, string>> => {
      return createTelemetryHeaders(options)
    },
    url: options.logEndpoint,
  })

  const loggerProvider = new LoggerProvider({
    processors: [
      new BatchLogRecordProcessor(logExporter),
    ],
    resource: createTelemetryResource(options),
  })

  if (options.debug) {
    console.log('[Telemetry] OpenTelemetry logging initialized.')
  }

  return Promise.resolve(loggerProvider.getLogger(options.serviceName, options.serviceVersion))
}
