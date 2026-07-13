import type { ConfigurationOptions } from 'typesense'

export type TypesenseCollectionsGlob = string | string[]

export interface TypesenseModuleOptions extends ConfigurationOptions {
  onClientError?: (error: unknown) => void
  collectionsGlob?: TypesenseCollectionsGlob
}
