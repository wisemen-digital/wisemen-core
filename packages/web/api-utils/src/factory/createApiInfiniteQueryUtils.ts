import { useKeysetInfiniteQuery as useBaseKeysetInfiniteQuery } from '@/composables/query/keysetInfiniteQuery.composable'
import { useOffsetInfiniteQuery as useBaseOffsetInfiniteQuery } from '@/composables/query/offsetInfiniteQuery.composable'
import type { QueryKeyParamsFromConfig } from '@/types/queryKeys.type'

import type {
  ApiUseKeysetInfiniteQueryOptions,
  ApiUseOffsetInfiniteQueryOptions,
  QueryKeyArrayItemFromConfig,
  QueryKeysWithArrayEntityFromConfig,
} from './createApiUtils.types'

export interface CreateApiInfiniteQueryUtilsReturnType<TQueryKeys extends object, TErrorCode extends string = string> {
  useKeysetInfiniteQuery: <TKey extends QueryKeysWithArrayEntityFromConfig<TQueryKeys>>(
    key: TKey,
    queryOptions: ApiUseKeysetInfiniteQueryOptions<TQueryKeys, TKey, TErrorCode>,
  ) => ReturnType<typeof useBaseKeysetInfiniteQuery<QueryKeyArrayItemFromConfig<TQueryKeys, TKey>, TErrorCode>>
  useOffsetInfiniteQuery: <TKey extends QueryKeysWithArrayEntityFromConfig<TQueryKeys>>(
    key: TKey,
    queryOptions: ApiUseOffsetInfiniteQueryOptions<TQueryKeys, TKey, TErrorCode>,
  ) => ReturnType<typeof useBaseOffsetInfiniteQuery<QueryKeyArrayItemFromConfig<TQueryKeys, TKey>, TErrorCode>>
}

export function createApiInfiniteQueryUtils<TQueryKeys extends object, TErrorCode extends string = string>():
CreateApiInfiniteQueryUtilsReturnType<TQueryKeys, TErrorCode> {
  function useOffsetInfiniteQuery<TKey extends QueryKeysWithArrayEntityFromConfig<TQueryKeys>>(
    key: TKey,
    queryOptions: ApiUseOffsetInfiniteQueryOptions<TQueryKeys, TKey, TErrorCode>,
  ) {
    type Params = QueryKeyParamsFromConfig<TQueryKeys, TKey>

    const params = (queryOptions as { params?: Params }).params ?? ({} as Params)
    const queryKey = {
      [key]: params,
    } as { [K in TKey]: Params }

    return useBaseOffsetInfiniteQuery<QueryKeyArrayItemFromConfig<TQueryKeys, TKey>, TErrorCode>({
      staleTime: queryOptions.staleTime,
      isEnabled: queryOptions.isEnabled,
      limit: queryOptions.limit,
      queryFn: queryOptions.queryFn,
      queryKey,
    })
  }

  function useKeysetInfiniteQuery<TKey extends QueryKeysWithArrayEntityFromConfig<TQueryKeys>>(
    key: TKey,
    queryOptions: ApiUseKeysetInfiniteQueryOptions<TQueryKeys, TKey, TErrorCode>,
  ) {
    type Params = QueryKeyParamsFromConfig<TQueryKeys, TKey>

    const params = (queryOptions as { params?: Params }).params ?? ({} as Params)
    const queryKey = {
      [key]: params,
    } as { [K in TKey]: Params }

    return useBaseKeysetInfiniteQuery<QueryKeyArrayItemFromConfig<TQueryKeys, TKey>, TErrorCode>({
      staleTime: queryOptions.staleTime,
      isEnabled: queryOptions.isEnabled,
      limit: queryOptions.limit,
      queryFn: queryOptions.queryFn,
      queryKey,
    })
  }

  return {
    useKeysetInfiniteQuery,
    useOffsetInfiniteQuery,
  }
}
