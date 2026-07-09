import { Inject, Injectable } from '@nestjs/common'
import Typesense, { MultiSearchResultsParameters, SearchParams } from 'typesense'
import { MODULE_OPTIONS_TOKEN } from '../typesense.module-definitions.js'
import type { TypesenseModuleOptions } from '../typesense.module-options.js'
import { TypesenseUnavailableError } from './typesense-unavailable.error.js'
import { getTypesenseCollectionName } from '../schema/collection.js'
import type { TypesenseCollection, TypesenseCollectionName } from '../schema/collection.js'
import type { InferDocumentType } from '../schema/document.js'
import { captureException } from '@wisemen/opentelemetry'
import { PaginatedOffsetResponseMeta, PaginatedOffsetResponse } from '@wisemen/pagination'
import { TYPESENSE_DEFAULT_LIMIT, TYPESENSE_DEFAULT_OFFSET, TYPESENSE_MAX_HITS } from '../typesense.constant.js'
import { TypesenseGroupSearchResult, TypesenseGroupResponseMeta, TypesenseGroupHit } from './typesense-group-search.type.js'
import { CustomMultiSearchRequestSchemas, MultiSearchResponse } from './typesense-multi-search.type.js'
import { TypesenseSearchParamsBuilder } from '../params-builder/search-params.builder.js'
import type { TypesenseSearchParams } from '../params-builder/search-result.types.js'
import { TypesenseCollectors } from '../collectors/typesense-collectors.js'

type SearchResultDocument<
  TCollection extends TypesenseCollection,
  TSearchParams
> =
  TSearchParams extends TypesenseSearchParams<infer TResult>
    ? TResult
    : InferDocumentType<TCollection>

@Injectable()
export class TypesenseClient {
  private _client?: Typesense.Client

  constructor (
    @Inject(MODULE_OPTIONS_TOKEN) private options: TypesenseModuleOptions,
    private collectors: TypesenseCollectors
  ) {
    this.initialize()
  }

  /**
   * Returns the initialized Typesense SDK client.
   *
   * @throws {TypesenseUnavailableError}
   * Thrown when the module was registered without a valid Typesense client
   * configuration.
   */
  get client (): Typesense.Client {
    if (this._client == null) {
      this.initialize()
      return this._client!
    } else {
      return this._client
    }
  }

  /**
   * Creates a typed search params builder for a collection.
   */
  createParamBuilder<TCollection extends TypesenseCollection> (
    collection: TCollection
  ): TypesenseSearchParamsBuilder<TCollection> {
    return new TypesenseSearchParamsBuilder(collection)
  }

  /**
   * Upserts already transformed Typesense documents into a collection.
   *
   * When `collectionName` is omitted, the alias for `collection` is resolved
   * first and the resolved collection is written to.
   */
  async addDocuments<TCollection extends TypesenseCollection> (
    collection: TCollection | string,
    documents: InferDocumentType<TCollection>[],
    collectionName?: string
  ): Promise<void> {
    if (documents.length === 0) {
      return
    }

    if (collectionName == null) {
      const aliasName = typeof collection === 'string'
        ? collection
        : getTypesenseCollectionName(collection)
      const alias = await this.client.aliases(aliasName).retrieve()
      collectionName = alias.collection_name
    }

    await this.client
      .collections(collectionName)
      .documents()
      .import(documents, { batch_size: 100, action: 'upsert' })
  }

  /**
   * Deletes documents from a collection by their document ids.
   */
  async deleteDocuments (
    collection: TypesenseCollection | string, 
    ids: string[]
  ): Promise<void> {
    if (ids.length === 0) {
      return
    }

    await this.client
      .collections(getTypesenseCollectionName(collection))
      .documents()
      .delete({
        filter_by: `id: [${ids.join(',')}]`,
        batch_size: 100,
        ignore_not_found: true
      })
  }

  /**
   * Removes every document from a collection.
   */
  async truncateCollection (
    collection: TypesenseCollection | string
  ): Promise<void> {
    await this.client
      .collections(getTypesenseCollectionName(collection))
      .documents()
      .delete({ truncate: true })
  }

  /**
   * Uses the registered collector for a collection to transform already loaded
   * entities into Typesense documents, then upserts those documents.
   *
   * This method does not call `collector.fetch(...)`; it only delegates to
   * `collector.transform(...)`.
   */
  async importManually<T, TCollection extends TypesenseCollection> (
    collection: TCollection | string,
    objects: T[]
  ): Promise<void> {
    const collector = this.collectors.get<TCollection>(getTypesenseCollectionName(collection))
    await this.addDocuments(collection, collector.transform(objects))
  }

  /**
   * Uses the registered collector for a collection to fetch entities by id and
   * transform each fetched batch into Typesense documents before upserting them.
   *
   * Internally this calls `collector.fetch(...)` followed by
   * `collector.transform(...)` for every yielded batch.
   */
  async import (collection: TypesenseCollectionName, uuids?: string[]): Promise<void> {
    const collector = this.collectors.get(collection)
    const collectorResult = collector.fetch(uuids)

    for await (const entities of collectorResult) {
      await this.addDocuments(
        collection,
        collector.transform(entities)
      )
    }
  }

  /**
   * Uses the registered collector for a collection to fetch entities changed
   * since a timestamp and transform each fetched batch into Typesense documents
   * before upserting them.
   *
   * Internally this calls `collector.fetchChanged(...)` followed by
   * `collector.transform(...)` for every yielded batch.
   */
  async importChanged (collection: TypesenseCollectionName, since: Date): Promise<void> {
    const collector = this.collectors.get(collection)
    const collectorResult = collector.fetchChanged(since)

    for await (const entities of collectorResult) {
      await this.addDocuments(
        collection,
        collector.transform(entities)
      )
    }
  }

  /**
   * Uses the registered collector for a collection to fetch removed document
   * ids since a timestamp and delete them from Typesense.
   *
   * If the collector does not implement `fetchRemoved(...)`, this method is a
   * no-op.
   */
  async deleteRemoved (collection: TypesenseCollectionName, since: Date): Promise<void> {
    const collector = this.collectors.get(collection)
    const collectorResult = collector.fetchRemoved?.(since)

    if (collectorResult === undefined) {
      return
    }

    for await (const uuids of collectorResult) {
      await this.deleteDocuments(collection, uuids)
    }
  }

  /**
   * Executes a typed search query against a collection.
   */
  async search<
    TCollection extends TypesenseCollection,
    TSearchParams extends SearchParams<InferDocumentType<TCollection>> | TypesenseSearchParams<object>
  > (
    collection: TCollection,
    searchParams: TSearchParams
  ): Promise<PaginatedOffsetResponse<SearchResultDocument<TCollection, TSearchParams>>> {
    this.validateLimit(searchParams as SearchParams<object>)

    try {
      const result = await this.client
        .collections(getTypesenseCollectionName(collection))
        .documents()
        .search(searchParams as SearchParams<object>)

      const limit = result.request_params.per_page ?? TYPESENSE_DEFAULT_LIMIT
      const offset = searchParams.offset ?? TYPESENSE_DEFAULT_OFFSET
      const meta = new PaginatedOffsetResponseMeta(result.found, offset, limit)
      const documents = result.hits?.map(hit => hit.document) ?? []
      const items = documents as unknown as SearchResultDocument<TCollection, TSearchParams>[]

      return new PaginatedOffsetResponse<SearchResultDocument<TCollection, TSearchParams>>(items, meta)
    } catch (e) {
      captureException(e)

      throw new Error('[Typesense] Query failed: ' + (e as Error).message)
    }
  }

  /**
   * Executes a grouped search query against a collection.
   */
  async searchGrouped<
    TCollection extends TypesenseCollection,
    TSearchParams extends SearchParams<InferDocumentType<TCollection>> | TypesenseSearchParams<object>
  > (
    collection: TCollection,
    searchParams: TSearchParams
  ): Promise<TypesenseGroupSearchResult<SearchResultDocument<TCollection, TSearchParams>>> {
    this.validateLimit(searchParams as SearchParams<object>)

    try {
      const res = await this.client
        .collections(getTypesenseCollectionName(collection))
        .documents()
        .search(searchParams as SearchParams<object>)

      const limit = res.request_params.per_page ?? TYPESENSE_DEFAULT_LIMIT
      const offset = searchParams.offset ?? TYPESENSE_DEFAULT_OFFSET
      const meta = new TypesenseGroupResponseMeta(res.found, res.found_docs ?? 0, offset, limit)
      const groups: TypesenseGroupHit<SearchResultDocument<TCollection, TSearchParams>>[] = (res.grouped_hits ?? []).map((group) => ({
        groupKeys: group.group_key,
        total: group.found ?? 0,
        items: (group.hits ?? []).map(hit => hit.document) as SearchResultDocument<TCollection, TSearchParams>[]
      }))

      return { groups, meta }
    } catch (e) {
      captureException(e)

      throw new Error('[Typesense] Query failed: ' + (e as Error).message)
    }
  }

  /**
   * Executes multiple searches in a single Typesense multi-search request.
   */
  async multiSearch<TCollection extends TypesenseCollection> (
    collectionSearches: CustomMultiSearchRequestSchemas<TCollection>,
    commonSearch: MultiSearchResultsParameters<InferDocumentType<TCollection>[], string>
  ): Promise<MultiSearchResponse<TCollection>> {
    try {
      const searches = collectionSearches.map(s => ({ ...s, collection: getTypesenseCollectionName(s.collection) }))
      const searchResponse = await this.client.multiSearch.perform({ searches }, commonSearch)

      const response = {} as MultiSearchResponse<TCollection>

      searchResponse.results.map((item, index) => {
        const collectionName = getTypesenseCollectionName(collectionSearches[index].collection)

        response[collectionName] = (item.hits ?? []).map((hit) => ({
          item: hit.document,
          text_match: hit.text_match
        }))
      })

      return response
    } catch (e) {
      captureException(e)

      throw new Error('[Typesense] Query failed: ' + (e as Error).message)
    }
  }

  private handleError (error: unknown): void {
    if (this.options.onClientError != null) {
      this.options.onClientError(error)
    } else {
      throw error
    }
  }

  private initialize (): void {
    try {
      const { onClientError: _onClientError, ...configuration } = this.options

      this._client = new Typesense.Client(configuration)
    } catch (error) {
      this.handleError(error)
    }
  }

  private validateLimit (searchParams: SearchParams<object>): void {
    const limit = searchParams.limit ?? TYPESENSE_DEFAULT_LIMIT
    const groupLimit = searchParams.group_limit ?? 1

    const estimatedLimit = limit * groupLimit

    if (estimatedLimit > TYPESENSE_MAX_HITS) {
      throw new Error(`${estimatedLimit} exceeds the maximum allowed hits of ${TYPESENSE_MAX_HITS}.`)
    }
  }
}
