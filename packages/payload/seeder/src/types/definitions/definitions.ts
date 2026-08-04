import type {
  CollectionSlug,
  GlobalSlug,
} from 'payload'

import type { SeedDisabledMarker } from '#types/plugin/collectionMarkers'
import type { SeedTokens } from '#types/tokens/seedTokens'

import type {
  CollectionSeedData,
  GlobalSeedData,
} from './seedData'

export type SeedBuilder<T> = (tokens: SeedTokens) => T

export interface SeedDefinitionOptions {
  disabled?: SeedDisabledMarker
  /** Keep existing records for this definition and reuse them for seed references. */
  skipIfExists?: boolean
}

export interface GlobalSeedDefinition<TSlug extends GlobalSlug = GlobalSlug> {
  readonly build: SeedBuilder<GlobalSeedData<TSlug>>
  readonly disabled?: SeedDisabledMarker
  readonly kind: 'global'
  readonly slug: TSlug
}

export interface CollectionSeedDefinition<TSlug extends CollectionSlug = CollectionSlug> {
  readonly build: SeedBuilder<Array<CollectionSeedData<TSlug>>>
  readonly disabled?: SeedDisabledMarker
  readonly kind: 'collection'
  readonly skipIfExists?: boolean
  readonly slug: TSlug
}

export type SeedDefinition = CollectionSeedDefinition | GlobalSeedDefinition
