/* eslint-disable no-console */

import { ZoneContextManager } from '@opentelemetry/context-zone'
import type { ExportResult } from '@opentelemetry/core'
import { ExportResultCode } from '@opentelemetry/core'
import { OTLPTraceExporter } from '@opentelemetry/exporter-trace-otlp-http'
import type { OTLPExporterNodeConfigBase } from '@opentelemetry/otlp-exporter-base'
import { resourceFromAttributes } from '@opentelemetry/resources'
import type { ReadableSpan } from '@opentelemetry/sdk-trace-base'
import {
  BatchSpanProcessor,
  WebTracerProvider,
} from '@opentelemetry/sdk-trace-web'

import type { OpenTelemetryOptions } from '@/types.ts'

export async function initOpenTelemetry(options: OpenTelemetryOptions): Promise<void> {
  console.log('Initializing OpenTelemetry tracing...', options)

  const endpoint = options.traceEndpoint

  if (endpoint == null) {
    console.warn('OpenTelemetry is disabled. No trace endpoint provided.')

    return
  }

  const accessToken = await options.accessTokenFn()

  const customOTLPTraceExporter = new CustomOTLPTraceExporter({
    headers: {
      'Authorization': `Bearer ${accessToken}`,
      'Content-Type': 'application/json',
    },
    url: `${endpoint}`,
  }, options.accessTokenFn)

  const tracerProvider = new WebTracerProvider({
    resource: resourceFromAttributes({
      'deployment.build': options.buildNumber ?? 'unknown',
      'deployment.commit': options.commitHash ?? 'unknown',
      'deployment.environment': options.environment ?? 'unknown',
      'deployment.timestamp': options.buildTimestamp ?? 'unknown',
      'service.name': options.serviceName,
    }),
    spanProcessors: [
      new BatchSpanProcessor(customOTLPTraceExporter),
    ],
  })

  tracerProvider.register({
    contextManager: new ZoneContextManager(),
  })
}

// https://github.com/open-telemetry/opentelemetry-js/issues/2903
export class CustomOTLPTraceExporter extends OTLPTraceExporter {
  private _headers: Record<string, unknown>
  private accessTokenFn: () => Promise<string>

  constructor(
    config: OTLPExporterNodeConfigBase,
    accessTokenFn: () => Promise<string>,
  ) {
    super(config)
    this._headers = {
      ...config.headers,
    }
    this.accessTokenFn = accessTokenFn
  }

  async export(
    items: ReadableSpan[],
    resultCallback: (result: ExportResult) => void,
  ): Promise<void> {
    const token = await this.accessTokenFn()

    if (token !== null) {
      this._headers = {
        ...this._headers,
        Authorization: `Bearer ${token}`,
      }
    }

    if (!this._headers?.Authorization) {
      resultCallback({
        code: ExportResultCode.FAILED,
      })

      return
    }

    /* @ts-expect-error delegate */
    const params = this._delegate?._transport?._transport?._parameters

    if (typeof params === 'object' && params !== null) {
      params.headers = (): Record<string, unknown> => {
        return this._headers
      }
    }

    return super.export(items, (result) => {
      return resultCallback(result)
    })
  }
}
