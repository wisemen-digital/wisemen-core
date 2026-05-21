import type { Instrumentation } from '@opentelemetry/instrumentation'
import { registerInstrumentations } from '@opentelemetry/instrumentation'
import { FetchInstrumentation } from '@opentelemetry/instrumentation-fetch'
import { UserInteractionInstrumentation } from '@opentelemetry/instrumentation-user-interaction'

const ALL_CORS_URLS_REGEX = /.*/
let defaultInstrumentationsRegistered = false

function createDefaultInstrumentations(): Instrumentation[] {
  return [
    new UserInteractionInstrumentation({
      eventNames: [
        'click',
        'change',
        'keydown',
      ],
    }),
    new FetchInstrumentation({
      propagateTraceHeaderCorsUrls: ALL_CORS_URLS_REGEX,
    }),
  ]
}

export function registerDefaultAppInstrumentations(): void {
  if (defaultInstrumentationsRegistered) {
    return
  }

  registerInstrumentations({
    instrumentations: createDefaultInstrumentations(),
  })
  defaultInstrumentationsRegistered = true
}

/**
 * Register additional OpenTelemetry instrumentations for web applications.
 * Default Fetch and User Interaction instrumentations are registered once automatically.
 *
 * @param instrumentations - Additional instrumentations to register.
 */
export function registerAppInstrumentations(
  instrumentations?: Instrumentation[],
): void {
  registerDefaultAppInstrumentations()

  if (instrumentations == null || instrumentations.length === 0) {
    return
  }

  registerInstrumentations({
    instrumentations,
  })
}
