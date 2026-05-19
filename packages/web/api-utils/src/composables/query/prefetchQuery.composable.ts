import { useQueryClient } from '@tanstack/vue-query'

import { QUERY_CONFIG } from '@/config/config'
import type {
  RegisteredErrorCodes,
  RegisteredQueryKeyParams,
  RegisteredQueryKeys,
} from '@/register'
import type { ApiResult } from '@/types/apiError.type'

type WithParams<TKey extends PropertyKey>
  = RegisteredQueryKeyParams<TKey> extends undefined
    ? { params?: undefined }
    : { params: RegisteredQueryKeyParams<TKey> }

export type UsePrefetchQueryOptions<
  TKey extends keyof RegisteredQueryKeys,
  TData,
  TErrorCode extends string = RegisteredErrorCodes,
> = {
  /**
   * The time in milliseconds after which the prefetched query will be considered stale
   * @default config.prefetchStaleTime
   */
  staleTime?: number
  /**
   * Function that will be called when query is executed
   */
  queryFn: () => Promise<ApiResult<TData, TErrorCode>>
} & WithParams<TKey>

export function usePrefetchQuery<
  TKey extends keyof RegisteredQueryKeys,
  TData = unknown,
  TErrorCode extends string = RegisteredErrorCodes,
>(
  key: TKey,
  options: UsePrefetchQueryOptions<TKey, TData, TErrorCode>,
) {
  const queryClient = useQueryClient()
  const params = (options as { params?: unknown }).params

  async function execute(): Promise<void> {
    await queryClient.prefetchQuery({
      staleTime: options.staleTime ?? QUERY_CONFIG.prefetchStaleTime,
      queryFn: options.queryFn,
      queryKey: [
        key,
        params,
      ],
    })
  }

  return {
    execute,
  }
}
