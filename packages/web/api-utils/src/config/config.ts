import type { QueryClient } from '@tanstack/vue-query'

const DEFAULT_LIMIT = 20
const DEFAULT_PREFETCH_STALE_TIME = 60

export const QUERY_CONFIG = {
  prefetchStaleTime: DEFAULT_PREFETCH_STALE_TIME,
  limit: DEFAULT_LIMIT,
}

let globalQueryClient: QueryClient | null = null

/**
 * Initialize the API utilities with a QueryClient.
 * Call this once during app setup (e.g. in a plugin or main.ts).
 *
 * After calling this, `createApiUtils()` can be called without options.
 *
 * @example
 * ```typescript
 * import { initializeApiUtils } from '@wisemen/vue-core-api-utils'
 *
 * const queryClient = new QueryClient()
 * initializeApiUtils(queryClient)
 *
 * // Then in your api lib:
 * export const { useQuery, useMutation, ... } = createApiUtils<MyQueryKeys>()
 * ```
 */
export function initializeApiUtils(queryClient: QueryClient): void {
  globalQueryClient = queryClient
}

/**
 * @internal
 */
export function getQueryClient(): QueryClient {
  if (globalQueryClient == null) {
    throw new Error(
      '[api-utils] QueryClient not available. '
      + 'Call initializeApiUtils(queryClient) before using createApiUtils().',
    )
  }

  return globalQueryClient
}

export interface QueryConfig {
  /*
  * Time (in seconds) before a prefetch query is considered stale
  * After this time, the query will be refetched automatically in the background when it is rendered or accessed
  * @default 60
  */
  prefetchStaleTime: number
  /*
  * Default limit for pagination queries
  * @default 20
  */
  limit: number
}
export function setQueryConfig(config: Partial<QueryConfig>): void {
  if (config.limit != null && config.limit > 0) {
    QUERY_CONFIG.limit = config.limit
  }
  if (config.prefetchStaleTime != null && config.prefetchStaleTime > 0) {
    QUERY_CONFIG.prefetchStaleTime = config.prefetchStaleTime
  }
}
