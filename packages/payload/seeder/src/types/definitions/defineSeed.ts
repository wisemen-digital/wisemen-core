import type {
  CollectionSlug,
  GlobalSlug,
} from 'payload'

import type {
  CollectionSeedDefinition,
  GlobalSeedDefinition,
} from './definitions'
import type {
  CollectionSeedData,
  GlobalSeedData,
} from './seedData'

export type Exact<T, Shape> = T & Record<Exclude<keyof T, keyof Shape>, never>
export type ExactEach<T extends readonly unknown[], Shape> = { [I in keyof T]: Exact<T[I], Shape> }

export type ShapeFor<TSlug> = TSlug extends CollectionSlug
  ? ReadonlyArray<CollectionSeedData<TSlug>>
  : TSlug extends GlobalSlug
    ? GlobalSeedData<TSlug>
    : never

export type ExactFor<T, Shape> = Shape extends readonly unknown[]
  ? T extends readonly unknown[]
    ? ExactEach<T, Shape[number]>
    : never
  : Exact<T, Shape>

export type DefinitionFor<TSlug> = TSlug extends CollectionSlug
  ? CollectionSeedDefinition<TSlug>
  : TSlug extends GlobalSlug
    ? GlobalSeedDefinition<TSlug>
    : never
