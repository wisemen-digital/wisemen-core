import { useQueryClient } from '@tanstack/vue-query'

import { AsyncResult } from '@/async-result/asyncResult'
import { QUERY_CONFIG } from '@/config/config'
import type {
  RegisteredErrorCodes,
  RegisteredQueryKeyParams,
  RegisteredQueryKeys,
} from '@/register'
import type {
  OffsetPaginationAsyncResult,
  OffsetPaginationParams,
  OffsetPaginationResult,
} from '@/types/pagination.type'

type WithParams<TKey extends PropertyKey>
  = RegisteredQueryKeyParams<TKey> extends undefined
    ? { params?: undefined }
    : { params: RegisteredQueryKeyParams<TKey> }

export type PrefetchOffsetInfiniteQueryOptions<
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
  queryFn: (paginationParams: OffsetPaginationParams) => Promise<OffsetPaginationResult<TData, TErrorCode>>
} & WithParams<TKey>

export function usePrefetchOffsetInfiniteQuery<
  TKey extends keyof RegisteredQueryKeys,
  TData = unknown,
  TErrorCode extends string = RegisteredErrorCodes,
>(
  key: TKey,
  options: PrefetchOffsetInfiniteQueryOptions<TKey, TData, TErrorCode>,
) {
  const queryClient = useQueryClient()
  const params = (options as { params?: unknown }).params

  async function execute(): Promise<void> {
    await queryClient.prefetchInfiniteQuery({
      staleTime: options.staleTime ?? QUERY_CONFIG.prefetchStaleTime,
      getNextPageParam: (lastPage: OffsetPaginationAsyncResult<TData, TErrorCode>) => {
        if (!lastPage.isOk()) {
          return null
        }

        const total = lastPage.getValue().meta.offset + lastPage.getValue().meta.limit

        if (total >= lastPage.getValue().meta.total) {
          return null
        }

        return total
      },
      initialPageParam: 0,
      queryFn: async ({
        pageParam,
      }) =>
        AsyncResult.fromResult(await options.queryFn({
          limit: options.limit ?? QUERY_CONFIG.limit,
          offset: (pageParam ?? 0) as number,
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
