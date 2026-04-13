import type { QueryClientConfig } from '@tanstack/vue-query'
import {
  QueryClient,
  VueQueryPlugin,
} from '@tanstack/vue-query'
import type { App } from 'vue'

import { initializeApiUtils } from '@/config/config'

/**
 * Create a Vue plugin that sets up TanStack Query and initializes API utilities.
 *
 * This plugin handles:
 * - Creating a QueryClient with the provided config
 * - Installing VueQueryPlugin on the app
 * - Initializing the global QueryClient for api-utils
 *
 * @example
 * ```typescript
 * import { apiUtilsPlugin } from '@wisemen/vue-core-api-utils'
 * import { vueQueryClientConfig } from '@wisemen/vue-core-configs'
 *
 * app.use(apiUtilsPlugin(vueQueryClientConfig()))
 * ```
 *
 * @param config - QueryClient configuration
 * @returns A Vue plugin that can be used with app.use()
 */
export function apiUtilsPlugin(config: QueryClientConfig): {
  install: (app: App<any>) => void
} {
  const queryClient = new QueryClient(config)

  return {
    install: (app: App): void => {
      app.use(VueQueryPlugin, {
        queryClient,
      })
      initializeApiUtils(queryClient)
    },
  }
}
