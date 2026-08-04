import type { SanitizedConfig } from 'payload'
import { getPayload } from 'payload'

import { seed } from '#engine/run'
import {
  SEED_DISABLED_MESSAGE,
  seedingEnabled,
} from '#guard'
import { readSeedMarker } from '#lib/marker'
import type { SeedPluginOptions } from '#types'

export async function script(config: SanitizedConfig): Promise<void> {
  if (!seedingEnabled()) {
    console.error(SEED_DISABLED_MESSAGE)
    process.exitCode = 1

    return
  }
  const options: SeedPluginOptions = readSeedMarker(config)?.options ?? {}
  const payload = await getPayload({
    config,
  })

  try {
    const result = await seed({
      options,
      payload,
    })
    const total = Object.values(result.created).reduce((sum, n) => sum + n, 0)
    const skipped = result.skipped.length > 0 ? ` (${result.skipped.length} definition${result.skipped.length === 1 ? '' : 's'} skipped)` : ''

    payload.logger.info(`[payload-seed] created ${total} docs across ${Object.keys(result.created).length} collections${skipped}`)
  }
  finally {
    await payload.db.destroy?.()
  }

  process.exit(0)
}
