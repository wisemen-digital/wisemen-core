// oxlint-disable typescript/no-explicit-any
import type { SearchParams } from 'typesense/lib/Typesense/Documents.js'
import type { TypesenseCollection, TypesenseCollectionName } from '../schema/collection.js'
import type { TypesenseField, TypesenseFieldReference } from '../schema/field.js'
import type { InferDocumentFromFields, InferDocumentType, Simplify } from '../schema/document.js'
import type { CollectionField, ReferenceField, ReferencedCollection } from './filter.types.js'
import { TypesenseJoinStrategy } from './enums/typesense-join-strategy.enum.js'
import type { TypesenseJoinOptions } from './join-params.builder.js'

declare const typesenseSearchResultBrand: unique symbol

type ReferenceArrayFieldType = 'string[]' | 'int32[]' | 'int64[]'
type ReferenceScalarFieldType = 'string' | 'int32' | 'int64'

type JoinStrategyOf<TOptions> =
  TOptions extends { strategy: infer TStrategy extends TypesenseJoinStrategy }
    ? TStrategy
    : TypesenseJoinStrategy.NEST

type JoinAlias<TTarget extends TypesenseCollection, TOptions> =
  TOptions extends { alias: infer TAlias extends string }
    ? TAlias
    : TypesenseCollectionName<TTarget>

type SelectDocument<
  TTarget extends TypesenseCollection,
  TOptions
> =
  TOptions extends { select: infer TSelect }
    ? TSelect extends readonly (infer TField)[]
      ? InferDocumentFromFields<Extract<TField, CollectionField<TTarget>>>
      : TSelect extends (infer TField)[]
        ? InferDocumentFromFields<Extract<TField, CollectionField<TTarget>>>
        : InferDocumentType<TTarget>
    : InferDocumentType<TTarget>

type MergeDocuments<TBase extends object, TJoined extends object> =
  Simplify<Omit<TBase, keyof TJoined> & TJoined>

type AddNestedDocument<
  TBase extends object,
  TKey extends string,
  TValue,
  TOptional extends boolean = false
> = Simplify<
  Omit<TBase, TKey>
  & (
    TOptional extends true
      ? { [K in TKey]?: TValue }
      : { [K in TKey]: TValue }
  )
>

type IsArrayReferenceField<TField> =
  TField extends TypesenseField<string, infer TType, any, any>
    ? TType extends ReferenceArrayFieldType
      ? true
      : false
    : false

type DirectJoinValue<
  TField extends ReferenceField<any>,
  TSelected extends object,
  TStrategy extends TypesenseJoinStrategy
> =
  TStrategy extends TypesenseJoinStrategy.NEST_ARRAY
    ? TSelected[]
    : IsArrayReferenceField<TField> extends true
      ? TSelected[]
      : TSelected

type SourceReferenceFields<
  TTarget extends TypesenseCollection,
  TSource extends TypesenseCollection
> = Extract<CollectionField<TTarget>, { reference: TypesenseFieldReference<string, any, any, TSource> }>

type HasArrayReferenceToSource<
  TTarget extends TypesenseCollection,
  TSource extends TypesenseCollection
> =
  Extract<SourceReferenceFields<TTarget, TSource>, TypesenseField<string, ReferenceArrayFieldType, any, any>> extends never
    ? false
    : true

type HasScalarReferenceToSource<
  TTarget extends TypesenseCollection,
  TSource extends TypesenseCollection
> =
  Extract<SourceReferenceFields<TTarget, TSource>, TypesenseField<string, ReferenceScalarFieldType, any, any>> extends never
    ? false
    : true

type InverseJoinValue<
  TSource extends TypesenseCollection,
  TTarget extends TypesenseCollection,
  TSelected extends object,
  TStrategy extends TypesenseJoinStrategy
> =
  TStrategy extends TypesenseJoinStrategy.NEST_ARRAY
    ? TSelected[]
    : HasArrayReferenceToSource<TTarget, TSource> extends true
      ? TSelected[]
      : HasScalarReferenceToSource<TTarget, TSource> extends true
        ? TSelected | TSelected[]
        : TSelected | TSelected[]

export type TypesenseSearchParams<TResult extends object> =
  SearchParams<object> & {
    readonly [typesenseSearchResultBrand]: TResult
  }

export type InferSearchResultDocument<TSearchParams> =
  TSearchParams extends { readonly [typesenseSearchResultBrand]: infer TResult extends object }
    ? TResult
    : never

export type ApplyReferenceJoin<
  TBase extends object,
  TField extends ReferenceField<any>,
  TOptions extends TypesenseJoinOptions<ReferencedCollection<TField>> | undefined,
  TOptional extends boolean = false
> =
  JoinStrategyOf<TOptions> extends TypesenseJoinStrategy.MERGE
    ? MergeDocuments<TBase, SelectDocument<ReferencedCollection<TField>, TOptions>>
    : AddNestedDocument<
      TBase,
      JoinAlias<ReferencedCollection<TField>, TOptions>,
      DirectJoinValue<TField, SelectDocument<ReferencedCollection<TField>, TOptions>, JoinStrategyOf<TOptions>>,
      TOptional
    >

export type ApplyInverseJoin<
  TBase extends object,
  TSource extends TypesenseCollection,
  TTarget extends TypesenseCollection,
  TOptions extends TypesenseJoinOptions<TTarget> | undefined
> =
  JoinStrategyOf<TOptions> extends TypesenseJoinStrategy.MERGE
    ? MergeDocuments<TBase, SelectDocument<TTarget, TOptions>>
    : AddNestedDocument<
      TBase,
      JoinAlias<TTarget, TOptions>,
      InverseJoinValue<TSource, TTarget, SelectDocument<TTarget, TOptions>, JoinStrategyOf<TOptions>>
    >
