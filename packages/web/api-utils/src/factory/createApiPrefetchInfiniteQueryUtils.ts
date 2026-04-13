import type { QueryClient } from '@tanstack/vue-query'

import {
  getQueryClient,
  QUERY_CONFIG,
} from '@/config/config'
import type {
  KeysetPaginationParams,
  KeysetPaginationResult,
  OffsetPaginationParams,
  OffsetPaginationResult,
} from '@/types/pagination.type'
import type { QueryKeyParamsFromConfig } from '@/types/queryKeys.type'

import type {
  ApiUseKeysetInfinitePrefetchQueryOptions,
  ApiUseOffsetInfinitePrefetchQueryOptions,
  QueryKeyArrayItemFromConfig,
  QueryKeysWithArrayEntityFromConfig,
} from './createApiUtils.types'

const DEFAULT_LIMIT = QUERY_CONFIG.limit

export interface CreateApiPrefetchInfiniteQueryUtilsReturnType<
  TQueryKeys extends object, TErrorCode extends string = string,
>
{
  usePrefetchKeysetInfiniteQuery: <TKey extends QueryKeysWithArrayEntityFromConfig<TQueryKeys>>(
    key: TKey,
    queryOptions: ApiUseKeysetInfinitePrefetchQueryOptions<TQueryKeys, TKey, TErrorCode>,
  ) => {
    execute: () => Promise<void>
  }
  usePrefetchOffsetInfiniteQuery: <TKey extends QueryKeysWithArrayEntityFromConfig<TQueryKeys>>(
    key: TKey,
    queryOptions: ApiUseOffsetInfinitePrefetchQueryOptions<TQueryKeys, TKey, TErrorCode>,
  ) => {
    execute: () => Promise<void>
  }
}

export function createApiPrefetchInfiniteQueryUtils<TQueryKeys extends object, TErrorCode extends string = string>():
CreateApiPrefetchInfiniteQueryUtilsReturnType<TQueryKeys, TErrorCode> {
  function usePrefetchOffsetInfiniteQuery<TKey extends QueryKeysWithArrayEntityFromConfig<TQueryKeys>>(
    key: TKey,
    queryOptions: ApiUseOffsetInfinitePrefetchQueryOptions<TQueryKeys, TKey, TErrorCode>,
  ) {
    type TData = QueryKeyArrayItemFromConfig<TQueryKeys, TKey>
    type Page = OffsetPaginationResult<TData>

    type Params = QueryKeyParamsFromConfig<TQueryKeys, TKey>

    const params = (queryOptions as { params?: Params }).params ?? ({} as Params)
    const queryKey = [
      key,
      params,
    ] as const

    const queryClient: QueryClient = getQueryClient()

    async function execute(): Promise<void> {
      await queryClient.prefetchInfiniteQuery({
        staleTime: queryOptions.staleTime ?? QUERY_CONFIG.prefetchStaleTime,
        getNextPageParam: (lastPage: Page) => {
          if (lastPage.isErr()) {
            return null
          }

          const total = lastPage.value.meta.offset + lastPage.value.meta.limit

          if (total >= lastPage.value.meta.total) {
            return null
          }

          return total
        },
        initialPageParam: 0,
        queryFn: ({
          pageParam,
        }: { pageParam: unknown }) =>
          queryOptions.queryFn({
            limit: queryOptions.limit ?? DEFAULT_LIMIT,
            offset: (pageParam ?? 0) as OffsetPaginationParams['offset'],
          }),
        queryKey,
      })
    }

    return {
      execute,
    }
  }

  function usePrefetchKeysetInfiniteQuery<TKey extends QueryKeysWithArrayEntityFromConfig<TQueryKeys>>(
    key: TKey,
    queryOptions: ApiUseKeysetInfinitePrefetchQueryOptions<TQueryKeys, TKey, TErrorCode>,
  ) {
    type TData = QueryKeyArrayItemFromConfig<TQueryKeys, TKey>
    type Page = KeysetPaginationResult<TData>

    type Params = QueryKeyParamsFromConfig<TQueryKeys, TKey>

    const params = (queryOptions as { params?: Params }).params ?? ({} as Params)
    const queryKey = [
      key,
      params,
    ] as const

    async function execute(): Promise<void> {
      const queryClient: QueryClient = getQueryClient()

      await queryClient.prefetchInfiniteQuery({
        staleTime: queryOptions.staleTime ?? QUERY_CONFIG.prefetchStaleTime,
        getNextPageParam: (lastPage: Page) => {
          if (lastPage.isErr()) {
            return null
          }

          const next = lastPage.value.meta.next

          if (next === null || next === undefined) {
            return null
          }

          return next as string
        },
        initialPageParam: undefined as unknown as string | undefined,
        queryFn: ({
          pageParam,
        }: { pageParam: string | undefined }) =>
          queryOptions.queryFn({
            key: pageParam as KeysetPaginationParams['key'],
            limit: queryOptions.limit ?? DEFAULT_LIMIT,
          }),
        queryKey,
      })
    }

    return {
      execute,
    }
  }

  return {
    usePrefetchKeysetInfiniteQuery,
    usePrefetchOffsetInfiniteQuery,
  }
}
