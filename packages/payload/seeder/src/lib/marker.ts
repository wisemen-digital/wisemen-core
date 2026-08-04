import type { SanitizedConfig } from 'payload'

import type { PayloadSeedMarker } from '#types'

export function readSeedMarker(config: SanitizedConfig | undefined): PayloadSeedMarker | undefined {
  return config?.custom?.payloadSeed
}
