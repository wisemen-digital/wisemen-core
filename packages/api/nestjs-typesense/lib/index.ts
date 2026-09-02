import { createSearchParamsBuilder } from './params-builder/search-params.builder.js'
import {
  buildTypesenseCollection,
  getTypesenseCollectionHash,
  getTypesenseCollectionName,
  getTypesenseCollectionSchema,
  isCollection
} from './schema/collection.js'
import { TypesenseFieldBuilders } from './schema/field.js'
import { createGeopoint, parseGeopoint } from './transformers/geopoint.js'

export {
  getRegisteredTypesenseCollectionToken,
  isRegisteredTypesenseCollectionToken
} from './collections/typesense-collection.provider.js'
export { TypesenseCollections } from './collections/typesense-collections.js'
export { TypesenseCollectors } from './collectors/typesense-collectors.js'
export {
  RegisterTypesenseCollector,
  getTypesenseCollectorCollection,
  isTypesenseCollector
} from './collectors/typesense-collector.decorator.js'
export type { TypesenseCollector } from './collectors/typesense-collector.js'
export { TypesenseUnavailableError } from './client/typesense-unavailable.error.js'
export { TypesenseClient } from './client/typesense.client.js'
export {
  buildTypesenseCollection,
  getTypesenseCollectionHash,
  getTypesenseCollectionName,
  getTypesenseCollectionSchema,
  isCollection
} from './schema/collection.js'
export type { TypesenseCollection, TypesenseCollectionName } from './schema/collection.js'
export type { InferDocumentType } from './schema/document.js'
export type { InferDocumentFromFields } from './schema/document.js'
export type { ApplyInverseJoin, ApplyReferenceJoin, InferSearchResultDocument, TypesenseSearchParams } from './params-builder/search-result.types.js'
export { TypesenseMissingValues } from './params-builder/enums/typesense-missing-values.enum.js'
export {
  typesenseFieldConfig,
  TypesenseFieldBuilder
} from './schema/field.js'
export type {
  AnyTypesenseFieldBuilder,
  TypesenseCollectionFieldSchema,
  TypesenseField,
  TypesenseFieldFlags,
  TypesenseFieldType,
  TypesenseFieldValueFromType,
  TypesenseGeoPoint,
  TypesenseQueryByFieldType
} from './schema/field.js'
export {
  TYPESENSE_DEFAULT_COLLECTIONS_GLOB
} from './typesense.constant.js'
export type {
  TypesenseCollectionsGlob,
  TypesenseModuleOptions
} from './typesense.module-options.js'
export {
  CustomMultiSearchRequestSchemas,
  MappedMultiSearchResponseItem,
  MultiSearchRequestSchema,
  MultiSearchResponse,
  MultiSearchResponseItem
} from './client/typesense-multi-search.type.js'
export { TypesenseModule } from './typesense.module.js'

export const Typesense = {
  ...TypesenseFieldBuilders,
  collection: buildTypesenseCollection,
  collectionSchema: getTypesenseCollectionSchema,
  collectionHash: getTypesenseCollectionHash,
  createGeopoint: createGeopoint,
  parseGeopoint: parseGeopoint,
  isCollection: isCollection,
  collectionName: getTypesenseCollectionName,
  createSearchParamsBuilder: createSearchParamsBuilder
}
