import type {
  ResolvedSeedOptions,
  SeedPluginOptions,
} from './types'

export function resolveOptions(options: SeedPluginOptions = {}): ResolvedSeedOptions {
  return {
    definitions: options.definitions,
    enabled: options.enabled ?? true,
    options: {
      access: {
        run: options.options?.access?.run,
      },
      assetsDir: options.options?.assetsDir ?? 'assets',
      assetSubDirs: options.options?.assetSubDirs ?? {},
      locales: options.options?.locales,
    },
  }
}
