import { useQueryClient } from '@tanstack/vue-query'

import { QUERY_CONFIG } from '@/config/config'

import type { UseQueryOptions } from './query.composable'

export function usePrefetchQuery<TResData, TErrorCode extends string = string>(
  query: UseQueryOptions<TResData, TErrorCode>,
) {
  const queryClient = useQueryClient()

  function getQueryKey(): unknown[] {
    const entries = Object.entries(query.queryKey)
    const [
      first,
    ] = entries

    if (!first) {
      return []
    }
    const [
      queryKey,
      params,
    ] = first as [string, unknown]

    return [
      queryKey,
      params,
    ]
  }

  async function execute(): Promise<void> {
    await queryClient.prefetchQuery({
      staleTime: query.staleTime ?? QUERY_CONFIG.prefetchStaleTime,
      queryFn: query.queryFn,
      queryKey: getQueryKey(),
    })
  }

  return {
    execute,
  }
}
