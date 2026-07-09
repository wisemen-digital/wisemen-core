import { join } from 'node:path'

export const TYPESENSE_BATCH_SIZE = 100
export const TYPESENSE_DEFAULT_LIMIT = 10
export const TYPESENSE_DEFAULT_OFFSET = 0
export const TYPESENSE_DEFAULT_GROUP_LIMIT = 10
export const TYPESENSE_MAX_HITS = 250
export const TYPESENSE_HASH_KEY = 'hash'
export const TYPESENSE_DEFAULT_COLLECTIONS_GLOB = join(
  process.cwd(),
  'dist',
  '**',
  'typesense',
  '**',
  '*.typesense-collection.js'
)
