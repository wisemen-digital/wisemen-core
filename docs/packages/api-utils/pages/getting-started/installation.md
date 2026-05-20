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

Use `apiUtilsPlugin` to set up TanStack Query and initialize the API utilities in a single step:

```typescript
// filepath: src/main.ts

import { createApp } from 'vue'
import { apiUtilsPlugin } from '@wisemen/vue-core-api-utils'
import App from './App.vue'

const app = createApp(App)

app.use(apiUtilsPlugin({
  defaultOptions: {
    queries: {
      retry: 1,
      staleTime: 1000 * 60 * 5, // 5 minutes
    },
  },
}))

app.mount('#app')
```

## 5. Register your query keys and error codes

Use module augmentation to register your `ProjectQueryKeys` and error codes with the library. This unlocks full type safety across all composables without needing to pass generics everywhere.

```typescript
// filepath: src/api/index.ts

import type { ProjectQueryKeys } from '@/types/queryKey.type'

// Define your error codes
export type ERROR_KEYS = 'NOT_FOUND' | 'UNAUTHORIZED' | 'SERVER_ERROR'

// Register types with the library globally
declare module '@wisemen/vue-core-api-utils' {
  interface Register {
    queryKeys: ProjectQueryKeys
    errorCodes: ERROR_KEYS
  }
}

// Re-export composables for a single import path in your app
export {
  useKeysetInfiniteQuery,
  useMutation,
  useOffsetInfiniteQuery,
  usePrefetchKeysetInfiniteQuery,
  usePrefetchOffsetInfiniteQuery,
  usePrefetchQuery,
  useQuery,
} from '@wisemen/vue-core-api-utils'

// Export typed result types for convenience
export type {
  ApiResult,
  KeysetPaginationResult,
  OffsetPaginationResult,
} from '@wisemen/vue-core-api-utils'
```

### Typed query client helper

The library does not export a `useQueryClient` composable. Create a thin wrapper in your project for type-safe cache operations:

```typescript
// filepath: src/api/queryClient.ts

import { QueryClient, getTanstackQueryClient } from '@wisemen/vue-core-api-utils'
import type { ProjectQueryKeys } from '@/types/queryKey.type'

export function useQueryClient() {
  return new QueryClient<ProjectQueryKeys>(getTanstackQueryClient())
}
```

## 6. You're all set!

You now have:
- ✅ Typed queries with full TypeScript support
- ✅ Automatic error handling with result types
- ✅ Infinite pagination support (offset and keyset)
- ✅ Optimistic updates capability
- ✅ Query prefetching

Head over to the [Usage](../usage/overview.md) section to learn how to use these composables in your components.
