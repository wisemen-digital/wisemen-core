/* eslint-disable func-style */
import type { Plugin } from 'payload'

import type { GetSettingsCollectionDependencies } from '#collections/settings.collection.ts'

export function settingsPlugin(deps: GetSettingsCollectionDependencies): Plugin {
  const plugin: Plugin = async (config) => {
    const {
      getSettingsCollections,
    } = await import('#collections/settings.collection.ts')
    const settingsCollections = getSettingsCollections(deps)

    return {
      ...config,
      collections: [
        ...(config.collections ?? []),
        ...settingsCollections,
      ],
    }
  }

  return plugin
}
