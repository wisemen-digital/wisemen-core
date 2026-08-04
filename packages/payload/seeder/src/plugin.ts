import type {
  Config,
  Plugin,
} from 'payload'

import { binScriptPath } from './_kit'
import { createSeedEndpoint } from './endpoints/seed'
import { resolveOptions } from './options'
import { buildSeedRegistry } from './typegen'
import type {
  PayloadSeedMarker,
  SeedPluginOptions,
} from './types'

/**
 * Declarative, typed seeding: your `defineSeed` exports become one repeatable run. A
 * bootstrap tool for the data a project stands up with — every run is destructive.
 *
 * - `enabled`
 * - `definitions`
 * - `options`
 */
export function seedPlugin(opts: SeedPluginOptions = {}): Plugin {
  return (incomingConfig: Config): Config => {
    const resolved = resolveOptions(opts)

    if (!resolved.enabled) {
      return incomingConfig
    }

    // The package provides the command and endpoint. Projects decide where to
    // place their own reseed UI instead of receiving a global admin action.
    const marker: PayloadSeedMarker = {
      assetsDir: resolved.options.assetsDir,
      endpointPath: '/api/seed',
      options: opts,
    }

    const config: Config = {
      ...incomingConfig,
      bin: [
        ...(incomingConfig.bin ?? []),
        {
          key: 'seed',
          scriptPath: binScriptPath(import.meta.url, 'seed'),
        },
      ],
      custom: {
        ...incomingConfig.custom,
        payloadSeed: marker,
      },
      endpoints: [
        ...(incomingConfig.endpoints ?? []),
        createSeedEndpoint(resolved),
      ],
    }

    if (resolved.definitions?.length) {
      const definitions = resolved.definitions

      config.typescript = {
        ...config.typescript,
        postProcess: [
          ...(config.typescript?.postProcess ?? []),
          ({
            compiledTypes,
          }) => `${compiledTypes}\n\n${buildSeedRegistry(definitions)}\n`,
        ],
      }
    }

    return config
  }
}

export default seedPlugin
