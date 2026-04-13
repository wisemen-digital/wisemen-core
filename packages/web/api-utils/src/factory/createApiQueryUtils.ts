import type { UseQueryReturnType } from '@/composables/query/query.composable'
import { useQuery as useBaseQuery } from '@/composables/query/query.composable'
import type {
  QueryKeyEntityFromConfig,
  QueryKeyParamsFromConfig,
  QueryKeysWithEntityFromConfig,
} from '@/types/queryKeys.type'

import type { ApiUseQueryOptions } from './createApiUtils.types'

export interface CreateApiQueryUtilsReturnType<TQueryKeys extends object, TErrorCode extends string = string> {
  useQuery: <TKey extends QueryKeysWithEntityFromConfig<TQueryKeys>>(
    key: TKey,
    queryOptions: ApiUseQueryOptions<TQueryKeys, TKey, TErrorCode>,
  ) => UseQueryReturnType<QueryKeyEntityFromConfig<TQueryKeys, TKey>>
}

export function createApiQueryUtils<TQueryKeys extends object, TErrorCode extends string = string>():
CreateApiQueryUtilsReturnType<TQueryKeys, TErrorCode> {
  function useQuery<TKey extends QueryKeysWithEntityFromConfig<TQueryKeys>>(
    key: TKey,
    queryOptions: ApiUseQueryOptions<TQueryKeys, TKey, TErrorCode>,
  ): UseQueryReturnType<QueryKeyEntityFromConfig<TQueryKeys, TKey>> {
    type Params = QueryKeyParamsFromConfig<TQueryKeys, TKey>

    const params = (queryOptions as { params?: Params }).params ?? ({} as Params)
    const queryKey = {
      [key]: params,
    } as { [K in TKey]: Params }

    return useBaseQuery<QueryKeyEntityFromConfig<TQueryKeys, TKey>>({
      staleTime: queryOptions.staleTime,
      isDebug: queryOptions.isDebug,
      isEnabled: queryOptions.isEnabled,
      queryFn: queryOptions.queryFn,
      queryKey,
    })
  }

  return {
    useQuery,
  }
}
