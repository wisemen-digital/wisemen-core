import type { CollectionSlug } from 'payload'

import type { EndpointAccess } from '#_kit'
import type { SeedDefinition } from '#types/definitions/definitions'

export interface SeedAccessOptions {
  /** Who may run the seed (`POST /seed`). Defaults to any logged-in user. */
  run?: EndpointAccess
}

export interface SeedPluginOptions {
  /** Your `defineSeed` exports. Feeds both the seed run and the typed `SeedRegistry`. */
  definitions?: SeedDefinition[]
  /** Register nothing when false — no command, endpoint, button, or type augmentation. Default `true`. */
  enabled?: boolean
  /**
   * Everything else.
   *
   * - `assetsDir`
   * - `assetSubDirs`
   * - `access`
   */
  options?: SeedOptions
}

export interface SeedOptions {
  /**
   * Per-endpoint gate for the seed endpoint.
   *
   * - `run` — seed runner; defaults to any logged-in user
   */
  access?: SeedAccessOptions
  /** Root for `_file` source files, relative to the project. Default `'assets'`. */
  assetsDir?: string
  /** Per-collection subdirectory under `assetsDir`. Defaults to the collection slug. */
  assetSubDirs?: Partial<Record<CollectionSlug, string>>
  /** Locales to seed. Defaults to every locale configured in Payload. */
  locales?: string[]
}

/** `SeedPluginOptions` with the defaults applied — same keys, same nesting. */
export interface ResolvedSeedOptions {
  definitions: SeedDefinition[] | undefined
  enabled: boolean
  options: {
    access: { run: EndpointAccess | undefined }
    assetsDir: string
    assetSubDirs: Partial<Record<CollectionSlug, string>>
    locales?: string[]
  }
}
