import type { Instrumentation } from '@opentelemetry/instrumentation'
import { registerInstrumentations } from '@opentelemetry/instrumentation'
import { FetchInstrumentation } from '@opentelemetry/instrumentation-fetch'
import { UserInteractionInstrumentation } from '@opentelemetry/instrumentation-user-interaction'

import type { TelemetryTracePropagationUrl } from '@/types.ts'

const REGEXP_SPECIAL_CHARS_REGEX = /[.*+?^${}()|[\]\\]/g

let defaultInstrumentationsRegistered = false

export interface RegisterAppInstrumentationsOptions {
  instrumentations?: Instrumentation[]
  tracePropagationUrls: TelemetryTracePropagationUrl[]
}

function escapeRegExp(value: string): string {
  return value.replace(REGEXP_SPECIAL_CHARS_REGEX, '\\$&')
}

export function createTracePropagationMatchers(
  tracePropagationUrls: TelemetryTracePropagationUrl[],
): TelemetryTracePropagationUrl[] {
  return tracePropagationUrls
    .filter((url) => typeof url !== 'string' || url.trim() !== '')
    .map((url) => {
      if (url instanceof RegExp) {
        return url
      }

      const normalizedUrl = url.endsWith('/') ? url.slice(0, -1) : url

      return new RegExp(`^${escapeRegExp(normalizedUrl)}(?:$|[/?#])`)
    })
}

function createDefaultInstrumentations(
  tracePropagationUrls: TelemetryTracePropagationUrl[],
): Instrumentation[] {
  return [
    new UserInteractionInstrumentation({
      eventNames: [
        'click',
        'change',
        'keydown',
      ],
    }),
    new FetchInstrumentation({
      propagateTraceHeaderCorsUrls: createTracePropagationMatchers(tracePropagationUrls),
    }),
  ]
}

export function registerDefaultAppInstrumentations(
  tracePropagationUrls: TelemetryTracePropagationUrl[],
): void {
  if (defaultInstrumentationsRegistered) {
    return
  }

  registerInstrumentations({
    instrumentations: createDefaultInstrumentations(tracePropagationUrls),
  })
  defaultInstrumentationsRegistered = true
}

/**
 * Register additional OpenTelemetry instrumentations for web applications.
 * Default Fetch and User Interaction instrumentations are registered once automatically.
 *
 * @param options - Trace propagation URLs and additional instrumentations.
 */
export function registerAppInstrumentations(
  options: RegisterAppInstrumentationsOptions,
): void {
  registerDefaultAppInstrumentations(options.tracePropagationUrls)

  if (options.instrumentations == null || options.instrumentations.length === 0) {
    return
  }

  registerInstrumentations({
    instrumentations: options.instrumentations,
  })
}
