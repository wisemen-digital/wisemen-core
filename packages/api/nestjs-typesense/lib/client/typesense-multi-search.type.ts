/* eslint-disable @typescript-eslint/naming-convention */
import type { MultiSearchRequestSchema as BaseRequestSchema } from 'typesense/lib/Typesense/Types.js'
import type { TypesenseCollection, TypesenseCollectionName } from '../schema/collection.js'
import type { InferDocumentType } from '../schema/document.js'

export interface MultiSearchRequestSchema<TCollection extends TypesenseCollection>
  extends Omit<BaseRequestSchema<object, string>, 'collection'> {
  collection: TCollection | TypesenseCollectionName<TCollection>
}

export type CustomMultiSearchRequestSchemas<TCollection extends TypesenseCollection>
  = MultiSearchRequestSchema<TCollection>[]


export type MultiSearchResponse<TCollection extends TypesenseCollection> = {
  [K in TypesenseCollectionName<TCollection>]: MultiSearchResponseItem<TCollection>[]
}

export type MultiSearchResponseItem<TCollection extends TypesenseCollection> = {
  item: InferDocumentType<TCollection>
  text_match: number
}

export type MappedMultiSearchResponseItem<TCollection extends TypesenseCollection> = {
  collection: TypesenseCollectionName<TCollection>
  item: InferDocumentType<TCollection>
  text_match: number
}
