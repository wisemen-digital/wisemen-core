import { useQueryClient } from '@tanstack/vue-query'

import { AsyncResult } from '@/async-result/asyncResult'
import { QUERY_CONFIG } from '@/config/config'
import type {
  RegisteredErrorCodes,
  RegisteredQueryKeyParams,
  RegisteredQueryKeys,
} from '@/register'
import type {
  KeysetPaginationAsyncResult,
  KeysetPaginationParams,
  KeysetPaginationResult,
} from '@/types/pagination.type'

type WithParams<TKey extends PropertyKey>
  = RegisteredQueryKeyParams<TKey> extends undefined
    ? { params?: undefined }
    : { params: RegisteredQueryKeyParams<TKey> }

export type PrefetchKeysetInfiniteQueryOptions<
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
   * Maximum number of items to fetch per page
   * @default 20
   */
  limit?: number
  /**
   * Function that will be called when query is executed
   */
  queryFn: (paginationParams: KeysetPaginationParams) => Promise<KeysetPaginationResult<TData, TErrorCode>>
} & WithParams<TKey>

export function usePrefetchKeysetInfiniteQuery<
  TKey extends keyof RegisteredQueryKeys,
  TData = unknown,
  TErrorCode extends string = RegisteredErrorCodes,
>(
  key: TKey,
  options: PrefetchKeysetInfiniteQueryOptions<TKey, TData, TErrorCode>,
) {
  const queryClient = useQueryClient()
  const params = (options as { params?: unknown }).params

  async function execute(): Promise<void> {
    await queryClient.prefetchInfiniteQuery({
      staleTime: options.staleTime ?? QUERY_CONFIG.prefetchStaleTime,
      getNextPageParam: (lastPage: KeysetPaginationAsyncResult<TData, TErrorCode>) => {
        if (!lastPage.isOk()) {
          return null
        }

        const next = lastPage.getValue().meta.next

        return (next === null || next === undefined) ? null : next as string
      },
      initialPageParam: undefined as unknown as string | undefined,
      queryFn: async ({
        pageParam,
      }) =>
        AsyncResult.fromResult(await options.queryFn({
          key: pageParam as KeysetPaginationParams['key'],
          limit: options.limit ?? QUERY_CONFIG.limit,
        })),
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
