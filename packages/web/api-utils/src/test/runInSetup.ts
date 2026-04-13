/* eslint-disable unicorn/consistent-function-scoping */
import {
  QueryClient,
  VueQueryPlugin,
} from '@tanstack/vue-query'
import { afterEach } from 'vitest'
import type { VNode } from 'vue'
import {
  createApp,
  defineComponent,
  h,
} from 'vue'

import { initializeApiUtils } from '@/config/config'

let tempApp: ReturnType<typeof createApp> | null = null
let testContainer: HTMLElement | null = null
let queryClient: QueryClient | null = null

/**
 * Helper to run composables inside a setup context for testing
 * Executes the composable function within a Vue component's setup lifecycle
 *
 * @example
 * ```typescript
 * describe('my composable', () => {
 *   it('should work', () => {
 *     const result = runInSetup(() => myComposable())
 *     expect(result).toBeDefined()
 *   })
 * })
 * ```
 */
export function runInSetup<T>(composable: () => T): T {
  let result: T | null = null

  const TestComponent = defineComponent({
    setup() {
      result = composable()

      return (): VNode => h('div')
    },
  })

  // Create a new container for this test
  testContainer = document.createElement('div')
  document.body.appendChild(testContainer)

  // Create a fresh app instance with a new QueryClient for this test
  queryClient = new QueryClient({
    defaultOptions: {
      queries: {
        retry: false,
      },
    },
  })

  initializeApiUtils(queryClient)

  tempApp = createApp(TestComponent)
  tempApp.use(VueQueryPlugin, {
    queryClient,
  })

  tempApp.mount(testContainer)

  if (result === null) {
    throw new Error('Composable did not return a value')
  }

  return result
}

afterEach(() => {
  if (tempApp) {
    tempApp.unmount()
    tempApp = null
  }

  if (testContainer) {
    testContainer.remove()
    testContainer = null
  }

  if (queryClient) {
    queryClient.clear()
    queryClient = null
  }
})
