import { isRecord } from './_kit'
import type {
  AnyToken,
  FileToken,
  Ref,
  RegistryCollections,
  RegistryCollectionSlug,
} from './types'

export type {
  AnyRef, AnyToken, FileToken, Ref,
} from './types'

export function ref<C extends RegistryCollectionSlug>(collection: C, key: RegistryCollections[C] & string): Ref<C> {
  return {
    __seedRef: 'doc',
    collection,
    key,
  }
}

export function file(name: string, options: Record<string, unknown> = {}): FileToken {
  return {
    name,
    __seedRef: 'file',
    options,
  }
}

export function isRef(value: unknown): value is Ref {
  return isRecord(value) && value.__seedRef === 'doc'
}

export function isFileToken(value: unknown): value is FileToken {
  return isRecord(value) && value.__seedRef === 'file'
}

export function isAnyToken(value: unknown): value is AnyToken {
  return isRef(value) || isFileToken(value)
}
