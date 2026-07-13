// oxlint-disable typescript/no-explicit-any
import type { TypesenseCollection, TypesenseCollectionFields } from './collection.js'
import type { TypesenseField } from './field.js'

export type Simplify<T> = { [K in keyof T]: T[K] } & {}

type UnionToIntersection<T> =
  (T extends unknown ? (value: T) => void : never) extends (value: infer TIntersection) => void
    ? TIntersection
    : never

type InferDocumentField<TField> =
  TField extends TypesenseField<infer TName, any, infer TValue, infer TFlags>
    ? TFlags extends { optional: true }
      ? { [K in TName]?: TValue }
      : { [K in TName]: TValue }
    : never

type InferDocumentProperty<TKey extends string, TField> =
  TField extends TypesenseField<string, any, infer TValue, infer TFlags>
    ? TFlags extends { optional: true }
      ? { [K in TKey]?: TValue }
      : { [K in TKey]: TValue }
    : never

export type InferDocumentFromFields<TField> =
  Simplify<UnionToIntersection<InferDocumentField<TField>>>

export type InferDocumentType<TCollection extends TypesenseCollection> =
  Simplify<UnionToIntersection<{
    [K in keyof TypesenseCollectionFields<TCollection> & string]:
      InferDocumentProperty<K, TypesenseCollectionFields<TCollection>[K]>
  }[keyof TypesenseCollectionFields<TCollection> & string]>>
