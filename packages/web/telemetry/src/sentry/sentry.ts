import * as Sentry from '@sentry/vue'
import type { App } from 'vue'

import type { SentryOptions } from '@/types.ts'

export function initSentry(app: App, options: SentryOptions): void {
  function logWarning(message: string): void {
    if (options.debug) {
      console.warn(`[Sentry] ${message}`)
    }
  }

  const {
    debug = false,
    dsn,
    enabled = true,
    enableReplays = false,
    environment = 'production',
    replaysOnErrorSampleRate = 1.0,
    replaysSessionSampleRate = 0.1,
    sampleRate = 1.0,
  } = options

  if (!enabled || !dsn) {
    if (debug) {
      logWarning(`Initialization skipped: Sentry is disabled or DSN is not provided. enabled=${enabled}, dsn=${dsn}`)
    }

    return
  }

  const integrations = []

  if (enableReplays) {
    const replayIntegration = Sentry.replayIntegration({
      blockAllMedia: true,
      maskAllInputs: true,
      maskAllText: true,
    })

    integrations.push(replayIntegration)
  }

  Sentry.init({
    app,
    debug,
    dsn,
    environment,
    integrations,
    replaysOnErrorSampleRate,
    replaysSessionSampleRate,
    sampleRate,
  })

  if (debug) {
    logWarning(`Initialized with DSN: ${dsn}`)
  }
}
