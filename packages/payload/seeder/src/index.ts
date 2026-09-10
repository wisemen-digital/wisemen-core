export type { EndpointAccess } from './_kit'
export {
  default, seedPlugin,
} from './plugin'
export type { SeedPluginOptions } from './types'
export type { SeedAccessOptions } from './types'

// The typed view of `config.custom.payloadSeed` — resolve the configured paths from a script.
export { defineSeed } from './defineSeed'
/**
 * @deprecated Import `seed` from `@wisemen/payload-core-seeder/server` instead.
 * This lazy wrapper remains configuration-safe for existing consumers.
 */
export async function seed(...args: Parameters<typeof import('./engine/run').seed>) {
  const {
    seed: runSeed,
  } = await import('./engine/run')

  return runSeed(...args)
}
export {
  SeedRunError, SeedValidationError,
} from './engine/validate'
export { readSeedMarker } from './lib/marker'
export { registerAfterSeedListener } from './listeners'
export {
  file, isFileToken, isRef, ref,
} from './refs'
export type { PayloadSeedMarker } from './types'
export type { SeedRegistry } from './types'
export type { SeedTokens } from './types'
export type {
  FileToken, Ref,
} from './types'
export type {
  CollectionSeedData, GlobalSeedData, WithRefs,
} from './types'
export type { SeedResult } from './types'
export type { AfterSeedListener } from './types'
