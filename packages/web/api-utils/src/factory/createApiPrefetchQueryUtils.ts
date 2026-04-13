import type { QueryClient } from '@tanstack/vue-query'

import { AsyncResult } from '@/async-result/asyncResult'
import {
  getQueryClient,
  QUERY_CONFIG,
} from '@/config/config'
import type {
  QueryKeyParamsFromConfig,
  QueryKeysWithEntityFromConfig,
} from '@/types/queryKeys.type'

import type { ApiUsePrefetchQueryOptions } from './createApiUtils.types'

export interface CreateApiPrefetchQueryUtilsReturnType<TQueryKeys extends object, TErrorCode extends string = string> {
  usePrefetchQuery: <TKey extends QueryKeysWithEntityFromConfig<TQueryKeys>>(
    key: TKey,
    queryOptions: ApiUsePrefetchQueryOptions<TQueryKeys, TKey, TErrorCode>,
  ) => {
    execute: () => Promise<void>
  }
}

export function createApiPrefetchQueryUtils<TQueryKeys extends object, TErrorCode extends string = string>():
CreateApiPrefetchQueryUtilsReturnType<TQueryKeys, TErrorCode> {
  function usePrefetchQuery<TKey extends QueryKeysWithEntityFromConfig<TQueryKeys>>(
    key: TKey,
    queryOptions: ApiUsePrefetchQueryOptions<TQueryKeys, TKey, TErrorCode>,
  ) {
    const queryClient: QueryClient = getQueryClient()

    type Params = QueryKeyParamsFromConfig<TQueryKeys, TKey>

    const params = (queryOptions as { params?: Params }).params ?? ({} as Params)
    const queryKey = [
      key,
      params,
    ] as const

    async function execute(): Promise<void> {
      await queryClient.prefetchQuery({
        staleTime: queryOptions.staleTime ?? QUERY_CONFIG.prefetchStaleTime,
        queryFn: async () => {
          return AsyncResult.fromResult(await queryOptions.queryFn())
        },
        queryKey,
      })
    }

    return {
      execute,
    }
  }

  return {
    usePrefetchQuery,
  }
}
