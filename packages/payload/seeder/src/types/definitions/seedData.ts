import type {
  CollectionSlug,
  DataFromGlobalSlug,
  GlobalSlug,
  RequiredDataFromCollectionSlug,
  TypedLocale,
} from 'payload'

import type {
  FileToken,
  Ref,
} from '#types/tokens/tokens'

/** A value that can vary per Payload locale in a seed definition. */
export type LocalizedSeedValue<T> = Record<Extract<TypedLocale, string>, T> | T

export type WithRefs<T> = T extends Ref
  ? T
  : T extends Date
    ? LocalizedSeedValue<T>
    : T extends (infer U)[]
      ? LocalizedSeedValue<Array<Ref | WithRefs<U>>>
      : T extends object
        ? LocalizedSeedValue<{ [K in keyof T]: Ref | WithRefs<T[K]> }>
        : LocalizedSeedValue<T>

export type CollectionSeedData<TSlug extends CollectionSlug> = WithRefs<RequiredDataFromCollectionSlug<TSlug>> & {
  _file?: FileToken
  _key: string
}

export type GlobalSeedData<TSlug extends GlobalSlug> = WithRefs<
  Omit<DataFromGlobalSlug<TSlug>, 'createdAt' | 'globalType' | 'id' | 'updatedAt'>
>
