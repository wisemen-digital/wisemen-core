import type { QueryClientConfig } from '@tanstack/vue-query'
import { QueryCache } from '@tanstack/vue-query'
import defu from 'defu'

let onErrorCallback: ((error: Error) => void) | null = null

export const DEFAULT_VUE_QUERY_CLIENT_CONFIG: QueryClientConfig = {
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      retry: false,
    },
  },
  queryCache: new QueryCache({
    onError: (error): void => {
      if (onErrorCallback !== null) {
        onErrorCallback(error)

        return
      }

      console.error(error)
    },
  }),
}
export function setQueryOnErrorCallback(callback: (error: Error) => void): void {
  onErrorCallback = callback
}
export function vueQueryClientConfig(config?: QueryClientConfig): QueryClientConfig {
  return defu(config, DEFAULT_VUE_QUERY_CLIENT_CONFIG)
}
