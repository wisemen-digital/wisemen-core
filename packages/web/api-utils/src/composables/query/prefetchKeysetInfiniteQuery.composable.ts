import { useQueryClient } from '@tanstack/vue-query'

import { AsyncResult } from '@/async-result/asyncResult'
import { QUERY_CONFIG } from '@/config/config'
import type {
  KeysetPaginationAsyncResult,
  KeysetPaginationParams,
  KeysetPaginationResult,
} from '@/types/pagination.type'

export interface PrefetchKeysetInfiniteQueryOptions<TData, TErrorCode extends string = string> {
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
  queryFn: (paginationParams: KeysetPaginationParams) => Promise<KeysetPaginationResult<TData, TErrorCode>>
  /**
   * Query key associated with the query
   */
  queryKey: Record<string, unknown>
}

const DEFAULT_LIMIT = QUERY_CONFIG.limit

export function usePrefetchKeysetInfiniteQuery<TData, TErrorCode extends string = string>(
  options: PrefetchKeysetInfiniteQueryOptions<TData, TErrorCode>,
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
      getNextPageParam: (lastPage: KeysetPaginationAsyncResult<TData, TErrorCode>) => {
        if (lastPage.isErr() || lastPage.isLoading()) {
          return null
        }

        const next = lastPage.getValue().meta.next

        if (next === null || next === undefined) {
          return null
        }

        return next as string
      },
      initialPageParam: undefined as unknown as string | undefined,
      queryFn: async ({ pageParam }: { pageParam: string | undefined }) =>
        AsyncResult.fromResult(await options.queryFn({
          key: pageParam as KeysetPaginationParams['key'],
          limit: options.limit ?? DEFAULT_LIMIT,
        })),
      queryKey: getQueryKey(),
    })
  }

  return {
    execute,
  }
}
