import { useQueryClient } from '@tanstack/vue-query'

import { AsyncResult } from '@/async-result/asyncResult'
import { QUERY_CONFIG } from '@/config/config'
import type {
  OffsetPaginationAsyncResult,
  OffsetPaginationParams,
  OffsetPaginationResult,
} from '@/types/pagination.type'

export interface PrefetchOffsetInfiniteQueryOptions<TData, TErrorCode extends string = string> {
  /**
   * The time in milliseconds after which the query will be considered stale
   * @default QUERY_CONFIG.prefetchStaleTime
   */
  staleTime?: number
  /**
   * Maximum number of items to fetch per page, default can be set in config
   * @default 20
   */
  limit?: number
  /**
   * Function that will be called when query is executed
   * @returns Promise with response data
   */
  queryFn: (paginationParams: OffsetPaginationParams) => Promise<OffsetPaginationResult<TData, TErrorCode>>
  /**
   * Query key associated with the query
   */
  queryKey: Record<string, unknown>
}

const DEFAULT_LIMIT = QUERY_CONFIG.limit

export function usePrefetchOffsetInfiniteQuery<TData, TErrorCode extends string = string>(
  options: PrefetchOffsetInfiniteQueryOptions<TData, TErrorCode>,
): { execute: () => Promise<void> } {
  const queryClient = useQueryClient()

  function getQueryKey(): unknown[] {
    const entries = Object.entries(options.queryKey)
    const [first] = entries

    if (!first) {
      return []
    }

    const [queryKey, params] = first as [string, unknown]

    return [
      queryKey,
      params,
    ]
  }

  async function execute(): Promise<void> {
    await queryClient.prefetchInfiniteQuery({
      staleTime: options.staleTime ?? QUERY_CONFIG.prefetchStaleTime,
      getNextPageParam: (lastPage: OffsetPaginationAsyncResult<TData, TErrorCode>) => {
        if (lastPage.isErr() || lastPage.isLoading()) {
          return null
        }

        const total = lastPage.getValue().meta.offset + lastPage.getValue().meta.limit

        if (total >= lastPage.getValue().meta.total) {
          return null
        }

        return total
      },
      initialPageParam: 0,
      queryFn: async ({ pageParam }: { pageParam: unknown }) =>
        AsyncResult.fromResult(await options.queryFn({
          limit: options.limit ?? DEFAULT_LIMIT,
          offset: (pageParam ?? 0) as OffsetPaginationParams['offset'],
        })),
      queryKey: getQueryKey(),
    })
  }

  return {
    execute,
  }
}
