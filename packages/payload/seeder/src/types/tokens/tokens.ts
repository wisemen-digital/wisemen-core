import type {
  RegistryCollectionSlug,
  RegistryKey,
} from '#types/registry/registry'

export interface Ref<C extends RegistryCollectionSlug = RegistryCollectionSlug> {
  readonly __seedRef: 'doc'
  readonly collection: C
  readonly key: RegistryKey<C>
}

export interface FileToken {
  readonly name: string
  readonly __seedRef: 'file'
  readonly options: Record<string, unknown>
}

export type AnyRef = Ref

export type AnyToken = FileToken | Ref
