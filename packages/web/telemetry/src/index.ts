import * as Sentry from '@sentry/vue'
import type { App } from 'vue'

import { initOpenTelemetry } from './opentelemetry/tracing/tracer.ts'
import { initSentry } from './sentry/sentry.ts'
import type { TelemetryOptions } from './types.ts'

interface TelemetryUser {
  id?: string
  email?: string
}

export class Telemetry {
  constructor(private options: TelemetryOptions) {

  }

  captureException(error: any, context?: Record<string, any>): void {
    Sentry.captureException(error, {
      contexts: {
        additional: context,
      },
    })
  }

  captureMessage(message: string, level?: Sentry.SeverityLevel): void {
    Sentry.captureMessage(message, level)
  }

  async init(app: App): Promise<void> {
    if (this.options.sentry?.dsn !== undefined) {
      initSentry(app, this.options.sentry)
    }

    if (this.options.openTelemetry !== undefined && this.options.openTelemetry?.enabled !== false) {
      await initOpenTelemetry(this.options.openTelemetry)
    }
  }

  setExtra(key: string, value: any): void {
    Sentry.setExtra(key, value)
  }

  setTag(key: string, value: string): void {
    Sentry.setTag(key, value)
  }

  setTags(tags: Record<string, string>): void {
    Sentry.setTags(tags)
  }

  setUser(user: TelemetryUser): void {
    Sentry.setUser(user)
  }
}

export { registerAppInstrumentations } from './opentelemetry/tracing/instrumentation.ts'
