# Installation

Get `@wisemen/vue-core-api-utils` up and running in your project.

## 1. Install the package

::: code-group
```bash [pnpm]
pnpm install @wisemen/vue-core-api-utils
```

:::

## 2. Install peer dependencies

`@wisemen/vue-core-api-utils` requires the following peer dependencies:

::: code-group
```bash [pnpm]
pnpm install @tanstack/vue-query
```
:::

## 3. Define your query keys

Create a TypeScript interface that maps your query keys to their response types and parameters:

```typescript
// filepath: src/types/queryKey.type.ts

export interface ProjectQueryKeys {
  // Single entity queries
  userDetail: {
    entity: User
    params: { userId: string }
  }
  contactDetail: {
    entity: Contact
    params: { contactId: string }
  }

  // List queries with offset pagination
  userList: {
    entity: User[]
    params: { page: number; limit: number }
  }

  // List queries with keyset pagination
  contactList: {
    entity: Contact[]
    params: { limit: number; key?: string }
  }
}
```

## 4. Initialize in your Vue app

In your app setup or plugin file, initialize the API utils with your Vue Query client:

```typescript
// filepath: src/plugins/vueQuery.ts

import { App } from 'vue'
import { QueryClient, VueQueryPlugin } from '@tanstack/vue-query'
import { initializeApiUtils } from '@wisemen/vue-core-api-utils'

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
      staleTime: 1000 * 60 * 5, // 5 minutes
    },
  },
})

export const vueQueryPlugin = {
  install: (app: App): void => {
    app.use(VueQueryPlugin, { queryClient })
    initializeApiUtils(queryClient)
  },
}
```

Then register it in your main.ts:

```typescript
// filepath: src/main.ts

import { createApp } from 'vue'
import { vueQueryPlugin } from '@/plugins/vueQuery'
import App from './App.vue'

const app = createApp(App)
app.use(vueQueryPlugin)
app.mount('#app')
```

## 5. Create your API service layer

Now create your composables that consume the API utilities:

```typescript
// filepath: src/api/index.ts

import type {
  ApiResult as ApiUtilsApiResult,
  KeysetPaginationResult as ApiUtilsKeysetPaginationResult,
  OffsetPaginationResult as ApiUtilsOffsetPaginationResult,
} from '@wisemen/vue-core-api-utils'
import { createApiUtils } from '@wisemen/vue-core-api-utils'

import type { ProjectQueryKeys } from '@/types/queryKey.type'

// Define your error codes
export type ERROR_KEYS = 'NOT_FOUND' | 'UNAUTHORIZED' | 'SERVER_ERROR'

// Create typed composables
export const {
  useKeysetInfiniteQuery,
  useMutation,
  useOffsetInfiniteQuery,
  useQueryClient,
  usePrefetchKeysetInfiniteQuery,
  usePrefetchOffsetInfiniteQuery,
  usePrefetchQuery,
  useQuery,
} = createApiUtils<ProjectQueryKeys, ERROR_KEYS>()

// Export typed result types for convenience
export type ApiResult<T> = ApiUtilsApiResult<T, ERROR_KEYS>
export type OffsetPaginationResult<T> = ApiUtilsOffsetPaginationResult<T, ERROR_KEYS>
export type KeysetPaginationResult<T> = ApiUtilsKeysetPaginationResult<T, ERROR_KEYS>
```

## 6. You're all set!

You now have:
- ✅ Typed queries with full TypeScript support
- ✅ Automatic error handling with result types
- ✅ Infinite pagination support (offset and keyset)
- ✅ Optimistic updates capability
- ✅ Query prefetching

Head over to the [Usage](../usage/overview.md) section to learn how to use these composables in your components.
