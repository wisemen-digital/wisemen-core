import {
  getTypesenseCollectionName,
  type TypesenseCollection,
  type TypesenseCollectionName
} from '../schema/collection.js'

const TYPESENSE_COLLECTION_PROVIDER_PREFIX = 'wisemen.typesense-collection-provider'

export function getRegisteredTypesenseCollectionToken<
  TCollection extends TypesenseCollection
> (
  collection: TCollection | TypesenseCollectionName<TCollection> | string
): string {
  return `${TYPESENSE_COLLECTION_PROVIDER_PREFIX}:${getTypesenseCollectionName(collection)}`
}

export function isRegisteredTypesenseCollectionToken (token: unknown): token is string {
  return typeof token === 'string'
    && token.startsWith(`${TYPESENSE_COLLECTION_PROVIDER_PREFIX}:`)
}
