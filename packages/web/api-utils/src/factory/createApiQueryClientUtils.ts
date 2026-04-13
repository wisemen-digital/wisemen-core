import type { QueryClient as TanStackQueryClient } from '@tanstack/vue-query'

import { getQueryClient } from '@/config/config'
import { QueryClient } from '@/utils/query-client/queryClient'

export interface CreateApiQueryClientUtilsReturnType<
  TQueryKeys extends object,
> {
  useQueryClient: () => QueryClient<TQueryKeys>
}

export function createApiQueryClientUtils<TQueryKeys extends object>():
CreateApiQueryClientUtilsReturnType<TQueryKeys> {
  function useQueryClient(): QueryClient<TQueryKeys> {
    const qc: TanStackQueryClient = getQueryClient()

    return new QueryClient<TQueryKeys>(qc)
  }

  return {
    useQueryClient,
  }
}
