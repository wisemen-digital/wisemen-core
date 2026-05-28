---
name: getting-started
description: >
  Install @wisemen/vue-core-api-utils, initialize apiUtilsPlugin with QueryClient config, register typed query keys via module augmentation, set up a typed QueryClient wrapper.
type: lifecycle
library: vue-core-api-utils
---

# @wisemen/vue-core-api-utils — Getting Started

Get `@wisemen/vue-core-api-utils` installed, your Vue Query plugin initialized, query keys registered, and a typed QueryClient created.

## Setup

### 1. Install the package

```bash
pnpm install @wisemen/vue-core-api-utils @tanstack/vue-query neverthrow vue
```

### 2. Register your query keys via module augmentation

Augment the `Register` interface to define your query keys and error codes:

```typescript
// src/types/queryKey.type.ts

import type { Contact } from '@/models'

declare module '@wisemen/vue-core-api-utils' {
  interface Register {
    queryKeys: {
      contactDetail: {
        entity: Contact
        params: { contactUuid: string }
      }
      contactList: {
        entity: Contact[]
        params: { search?: string }
      }
      contactListKeyset: {
        entity: Contact[]
        params: { search?: string }
      }
    }
    errorCodes: 'NOT_FOUND' | 'UNAUTHORIZED' | 'VALIDATION_ERROR'
  }
}
```

Every key must have `entity` (response type) and `params` (filter/identifier parameters). Do not include pagination fields in params — those are handled by the infinite query composables.

### 3. Initialize the plugin in your main.ts

```typescript
// main.ts

import { createApp } from 'vue'
import { apiUtilsPlugin } from '@wisemen/vue-core-api-utils'
import App from './App.vue'

const app = createApp(App)

app.use(apiUtilsPlugin({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 5, // 5 minutes
      retry: 1,
    },
  },
}))

app.mount('#app')
```

The `apiUtilsPlugin` creates a QueryClient with your config and handles @tanstack/vue-query setup internally.

### 4. Create your API module

```typescript
// src/api/index.ts

import type {
  ApiResult as ApiUtilsApiResult,
  KeysetPaginationResult as ApiUtilsKeysetPaginationResult,
  OffsetPaginationResult as ApiUtilsOffsetPaginationResult,
} from '@wisemen/vue-core-api-utils'
import {
  QueryClient,
  getTanstackQueryClient,
  useQuery,
  useMutation,
  useOffsetInfiniteQuery,
  useKeysetInfiniteQuery,
} from '@wisemen/vue-core-api-utils'

// Re-export composables for convenience
export {
  useQuery,
  useMutation,
  useOffsetInfiniteQuery,
  useKeysetInfiniteQuery,
}

// Create a typed QueryClient helper
export function useQueryClient() {
  return new QueryClient(getTanstackQueryClient())
}

// Export typed result types
export type ApiResult<T> = ApiUtilsApiResult<T>
export type OffsetPaginationResult<T> = ApiUtilsOffsetPaginationResult<T>
export type KeysetPaginationResult<T> = ApiUtilsKeysetPaginationResult<T>
```

Composables are imported directly from the package. The `QueryClient` is a type-safe wrapper around the Tanstack QueryClient — its types are inferred from your `Register` augmentation.

## Core Patterns

### Create a detail query composable

```typescript
// src/composables/useContactDetail.ts

import { computed } from 'vue'
import { useQuery } from '@/api'
import { ContactService } from '@/services'

export function useContactDetail(contactUuid: string) {
  return useQuery('contactDetail', {
    params: { contactUuid: computed(() => contactUuid) },
    queryFn: () => ContactService.getByUuid(contactUuid),
    staleTime: 1000 * 60 * 5,
  })
}
```

Parameters must be computed refs so the query watches changes and refetches automatically.

### Create a mutation composable

```typescript
// src/composables/useCreateContact.ts

import { useMutation } from '@/api'
import { ContactService } from '@/services'

export function useCreateContact() {
  return useMutation({
    queryFn: async ({ body }: { body: ContactCreateForm }) => {
      return await ContactService.create(body)
    },
    queryKeysToInvalidate: {
      contactList: {},
    },
  })
}
```

Every mutation should list which queries to invalidate via `queryKeysToInvalidate`. An empty object `{}` invalidates all queries with that key.

### Use composables in components

```vue
<script setup lang="ts">
import { useContactDetail } from '@/composables'

const props = defineProps<{ contactUuid: string }>()
const { result, refetch } = useContactDetail(props.contactUuid)
</script>

<template>
  <div>
    <div v-if="result.isLoading()">Loading...</div>
    <div v-else-if="result.isOk()">
      Name: {{ result.getValue().name }}
    </div>
    <div v-else-if="result.isErr()">
      Error occurred
    </div>
    <button @click="refetch">Retry</button>
  </div>
</template>
```

All queries and mutations return `AsyncResult` with three states: loading, ok, and err.

## You're all set!

You now have:
- ✅ Plugin initialized with Vue Query
- ✅ Query keys registered via module augmentation
- ✅ Typed QueryClient wrapper created
- ✅ Error codes enumerated

Head to [writing-queries](../writing-queries/SKILL.md) to fetch your first resource, or [handling-asyncresult-types](../asyncresult-handling/SKILL.md) to understand the three-state AsyncResult type.
