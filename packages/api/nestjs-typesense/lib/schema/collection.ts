import type { CollectionCreateSchema } from 'typesense/lib/Typesense/Collections.js'
import type { AnyTypesenseField, AnyTypesenseFieldBuilder, TypesenseField, TypesenseFieldFlagsFor, TypesenseFieldTypeFor, TypesenseFieldValue } from './field.js'
import { TypesenseFieldBuilder } from './field.js'

export const typesenseCollectionName = Symbol.for('wisemen.typesense.collection.name')
export const typesenseCollectionFields = Symbol.for('wisemen.typesense.collection.fields')
export const typesenseCollectionSchema = Symbol.for('wisemen.typesense.collection.schema')

type Simplify<T> = { [K in keyof T]: T[K] } & {}

type TypesenseFieldBuilderRecord = Record<string, AnyTypesenseFieldBuilder>
type TypesenseFieldRecord = Record<string, AnyTypesenseField>

type BuildField<
  TFieldName extends string,
  TBuilder extends AnyTypesenseFieldBuilder
> = TBuilder extends TypesenseFieldBuilder<infer TType, infer TValue, infer TFlags>
  ? TypesenseField<TFieldName, TType, TValue, TFlags>
  : never

type BuildFields<TBuilders extends TypesenseFieldBuilderRecord> = {
  readonly [K in keyof TBuilders]: BuildField<K & string, TBuilders[K]>
}

type CollectionFields<TCollection extends AnyTypesenseCollection> = TCollection[typeof typesenseCollectionFields]
type SchemaFieldForField<TField extends AnyTypesenseField> = Pick<
  TField,
  'name' | 'type' | 'optional' | 'index' | 'sort' | 'facet' | 'infix'
>

type FieldNamesByFlag<
  TCollection extends AnyTypesenseCollection,
  TFlag extends keyof TypesenseFieldFlagsFor<CollectionFields<TCollection>[keyof CollectionFields<TCollection>]>,
  TValue extends boolean
> = {
  [K in keyof CollectionFields<TCollection>]:
  CollectionFields<TCollection>[K] extends AnyTypesenseField
    ? TypesenseFieldFlagsFor<CollectionFields<TCollection>[K]>[TFlag] extends TValue
      ? K
      : never
    : never
}[keyof CollectionFields<TCollection>] & string

type QueryByFieldNamesInternal<TCollection extends AnyTypesenseCollection> = {
  [K in keyof CollectionFields<TCollection>]:
  CollectionFields<TCollection>[K] extends AnyTypesenseField
    ? TypesenseFieldFlagsFor<CollectionFields<TCollection>[K]>['index'] extends true
      ? TypesenseFieldTypeFor<CollectionFields<TCollection>[K]> extends 'string' | 'string[]'
        ? K
        : never
      : never
    : never
}[keyof CollectionFields<TCollection>] & string

type OptionalFieldNames<TCollection extends AnyTypesenseCollection> = FieldNamesByFlag<TCollection, 'optional', true>
type RequiredFieldNames<TCollection extends AnyTypesenseCollection> = Exclude<CollectionFieldNames<TCollection>, OptionalFieldNames<TCollection>>

export interface TypesenseCollectionSchema<
  TCollectionName extends string = string,
  TFields extends TypesenseFieldRecord = TypesenseFieldRecord
> extends Omit<CollectionCreateSchema, 'name' | 'fields'> {
  readonly name: TCollectionName
  readonly fields: ReadonlyArray<TFields[keyof TFields] extends infer TField
    ? TField extends AnyTypesenseField
      ? SchemaFieldForField<TField>
      : never
    : never>
}

interface TypesenseCollectionMetadata<
  TCollectionName extends string,
  TFields extends TypesenseFieldRecord
> {
  readonly [typesenseCollectionName]: TCollectionName
  readonly [typesenseCollectionFields]: TFields
  readonly [typesenseCollectionSchema]: TypesenseCollectionSchema<TCollectionName, TFields>
}

export type TypesenseCollection<
  TCollectionName extends string = string,
  TFields extends TypesenseFieldRecord = TypesenseFieldRecord
> = TypesenseCollectionMetadata<TCollectionName, TFields> & TFields

export interface AnyTypesenseCollection {
  readonly [typesenseCollectionName]: string
  readonly [typesenseCollectionFields]: TypesenseFieldRecord
  readonly [typesenseCollectionSchema]: TypesenseCollectionSchema
}

export type CollectionFieldNames<TCollection extends AnyTypesenseCollection> = keyof CollectionFields<TCollection> & string
export type IndexedFieldNames<TCollection extends AnyTypesenseCollection> = FieldNamesByFlag<TCollection, 'index', true>
export type SortableFieldNames<TCollection extends AnyTypesenseCollection> = FieldNamesByFlag<TCollection, 'sort', true>
export type FacetedFieldNames<TCollection extends AnyTypesenseCollection> = FieldNamesByFlag<TCollection, 'facet', true>
export type QueryByFieldNames<TCollection extends AnyTypesenseCollection> = QueryByFieldNamesInternal<TCollection>

export type InferDocument<TCollection extends AnyTypesenseCollection> = Simplify<
{
  [K in RequiredFieldNames<TCollection>]: TypesenseFieldValue<CollectionFields<TCollection>[K]>
} & {
  [K in OptionalFieldNames<TCollection>]?: TypesenseFieldValue<CollectionFields<TCollection>[K]>
}
>

function toSchemaField<TField extends AnyTypesenseField> (
  field: TField
): SchemaFieldForField<TField> {
  return {
    name: field.name,
    type: field.type,
    optional: field.optional,
    index: field.index,
    sort: field.sort,
    facet: field.facet,
    infix: field.infix
  }
}

export function typesenseCollection<
  TCollectionName extends string,
  TBuilders extends TypesenseFieldBuilderRecord
> (
  name: TCollectionName,
  fields: TBuilders
): TypesenseCollection<TCollectionName, BuildFields<TBuilders>> {
  const builtFields = Object.fromEntries(
    Object.entries(fields).map(([fieldName, builder]) => {
      return [fieldName, builder.build(fieldName)]
    })
  ) as BuildFields<TBuilders>

  const schema = Object.freeze({
    name,
    fields: Object.values(builtFields).map(field => toSchemaField(field))
  }) as unknown as TypesenseCollectionSchema<TCollectionName, BuildFields<TBuilders>>

  return Object.freeze(
    Object.assign(
      builtFields,
      {
        [typesenseCollectionName]: name,
        [typesenseCollectionFields]: builtFields,
        [typesenseCollectionSchema]: schema
      }
    )
  ) as TypesenseCollection<TCollectionName, BuildFields<TBuilders>>
}

export function getTypesenseCollectionName<TCollection extends AnyTypesenseCollection> (
  collection: TCollection
): TCollection[typeof typesenseCollectionName] {
  return collection[typesenseCollectionName]
}

export function getTypesenseCollectionFields<TCollection extends AnyTypesenseCollection> (
  collection: TCollection
): TCollection[typeof typesenseCollectionFields] {
  return collection[typesenseCollectionFields]
}

export function getTypesenseCollectionSchema<TCollection extends AnyTypesenseCollection> (
  collection: TCollection
): TCollection[typeof typesenseCollectionSchema] {
  return collection[typesenseCollectionSchema]
}
