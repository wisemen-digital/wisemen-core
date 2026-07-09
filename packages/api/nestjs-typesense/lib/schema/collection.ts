import { createHash } from 'node:crypto'
import type { CollectionFieldSchema } from 'typesense/lib/Typesense/Collection.js'
import type { CollectionCreateSchema } from 'typesense/lib/Typesense/Collections.js'
import type { AnyTypesenseFieldBuilder, TypesenseFieldBuilder, TypesenseField } from './field.js'
import { canonicalize } from '../utils/json-canonicalize.js'

const typesenseCollectionName = Symbol('wisemen.typesense.collection.name')

type TypesenseFieldBuilderRecord = Record<string, AnyTypesenseFieldBuilder>
type TypesenseFieldRecord = Record<string, TypesenseField>
type TypesenseCollectionMetadata<TCollectionName extends string> = {
  readonly [typesenseCollectionName]: TCollectionName
}

type BuildField<
  TCollectionName extends string,
  TFieldName extends string,
  TBuilder extends AnyTypesenseFieldBuilder
> = TBuilder extends TypesenseFieldBuilder<infer TType, infer TValue, infer TFlags>
  ? TypesenseField<
    TFieldName,
    TType,
    TValue,
    TFlags,
    TypesenseCollection<TCollectionName>
  >
  : never

type BuildFields<
  TCollectionName extends string,
  TBuilders extends TypesenseFieldBuilderRecord
> = {
    readonly [K in keyof TBuilders]: BuildField<TCollectionName, K & string, TBuilders[K]>
  }

type Mutable<T> = {
  -readonly [K in keyof T]: T[K]
}

export type TypesenseCollection<
  TCollectionName extends string = string,
  TCollectionFields extends TypesenseFieldRecord = TypesenseFieldRecord
> = TCollectionFields & TypesenseCollectionMetadata<TCollectionName>

export type TypesenseCollectionName<TCollection extends TypesenseCollection = TypesenseCollection> =
  TCollection[typeof typesenseCollectionName]

export type TypesenseCollectionFieldNames<TCollection extends TypesenseCollection> =
  Extract<keyof TCollection, string>

export type TypesenseCollectionFields<TCollection extends TypesenseCollection> =
  Pick<TCollection, TypesenseCollectionFieldNames<TCollection>>

export function buildTypesenseCollection<
  TCollectionName extends string,
  TBuilders extends TypesenseFieldBuilderRecord
> (
  name: TCollectionName,
  fields: TBuilders
): TypesenseCollection<TCollectionName, BuildFields<TCollectionName, TBuilders>> {
  const collection = {} as Mutable<TypesenseCollection<TCollectionName, BuildFields<TCollectionName, TBuilders>>>

  Object.defineProperty(collection, typesenseCollectionName, {
    configurable: false,
    enumerable: false,
    value: name,
    writable: false
  })

  for (const [fieldName, fieldBuilder] of Object.entries(fields)) {
    collection[fieldName as keyof TBuilders & string] = fieldBuilder.build(
      fieldName,
      collection
    ) as TypesenseCollection<TCollectionName, BuildFields<TCollectionName, TBuilders>>[keyof TBuilders & string]
  }

  return Object.freeze(collection) as TypesenseCollection<TCollectionName, BuildFields<TCollectionName, TBuilders>>
}

export function getTypesenseCollectionName<
  TCollectionName extends string,
  TCollection extends TypesenseCollection<TCollectionName>
> (
  collection: TCollection | TCollectionName
): TypesenseCollectionName<TCollection> {
  if (typeof collection === 'string') {
    return collection
  }

  return collection[typesenseCollectionName]
}

export function getTypesenseCollectionSchema<TCollection extends TypesenseCollection> (
  collection: TCollection
): CollectionCreateSchema {
  return {
    name: getTypesenseCollectionName(collection),
    fields: getCollectionFields(collection)
      .filter(field => field.index)
      .map(field => mapFieldToSchema(field))
  }
}

export function getTypesenseCollectionHash<TCollection extends TypesenseCollection> (
  collection: TCollection
): string {
  const schema = getTypesenseCollectionSchema(collection)
  schema.fields.sort(sortByName)

  return createHash('sha256')
    .update(canonicalize({ schema }))
    .digest('hex')
}

export function isCollection (target: object): target is TypesenseCollection {
  return Object.hasOwn(target, typesenseCollectionName)
}

function getCollectionFields<TCollection extends TypesenseCollection> (
  collection: TCollection
): Array<TypesenseCollectionFields<TCollection>[keyof TypesenseCollectionFields<TCollection>]> {
  return Object.values(collection) as Array<TypesenseCollectionFields<TCollection>[keyof TypesenseCollectionFields<TCollection>]>
}

function mapFieldToSchema (field: TypesenseField): CollectionFieldSchema {
  const schema: CollectionFieldSchema = {
    name: field.name,
    type: field.type,
    optional: field.optional
  }

  if (field.sort) {
    schema.sort = true
  }

  if (field.infix) {
    schema.infix = true
  }

  if (field.facet) {
    schema.facet = true
  }

  if (field.reference !== undefined) {
    schema.reference = `${getTypesenseCollectionName(field.reference.collection)}.${field.reference.name}`
    schema.async_reference = true
  }

  return schema
}


function sortByName<TField extends { name: string }> (fieldA: TField, fieldB: TField): number {
  return fieldA.name.localeCompare(fieldB.name)
}
