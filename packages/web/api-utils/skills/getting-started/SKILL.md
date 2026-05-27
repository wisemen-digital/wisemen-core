---
name: getting-started
description: >
  Install @wisemen/vue-core-api-utils, initialize apiUtilsPlugin with QueryClient config, define typed query keys interface, create API composables with error codes.
type: lifecycle
library: vue-core-api-utils
---

# @wisemen/vue-core-api-utils — Getting Started

Get `@wisemen/vue-core-api-utils` installed, your Vue Query plugin initialized, query keys defined, and typed composables created.

## Setup

### 1. Install the package

```bash
pnpm install @wisemen/vue-core-api-utils @tanstack/vue-query neverthrow vue
```

### 2. Define your query keys

Create a TypeScript interface that maps query keys to their response types and parameters:

```typescript
// src/types/queryKey.type.ts

export interface ProjectQueryKeys {
  // Single entity query
  contactDetail: {
    entity: Contact
    params: { contactUuid: string }
  }
  
  // List query with offset pagination
  contactList: {
    entity: Contact[]
    params: { page: number; limit: number; search?: string }
  }
  
  // List query with keyset pagination
  contactListKeyset: {
    entity: Contact[]
    params: { limit: number; key?: string }
  }
}
```

Every key must have both `entity` (response type) and `params` (required parameters).

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

The `apiUtilsPlugin` function creates a QueryClient with your config and handles @tanstack/vue-query setup internally.

### 4. Create your API composables

```typescript
// src/api/index.ts

import type {
  ApiResult as ApiUtilsApiResult,
  KeysetPaginationResult as ApiUtilsKeysetPaginationResult,
  OffsetPaginationResult as ApiUtilsOffsetPaginationResult,
} from '@wisemen/vue-core-api-utils'
import { createApiUtils } from '@wisemen/vue-core-api-utils'

import type { ProjectQueryKeys } from '@/types/queryKey.type'

// Define your error codes
export type ERROR_KEYS = 'NOT_FOUND' | 'UNAUTHORIZED' | 'NETWORK_ERROR' | 'VALIDATION_ERROR'

// Create factory with your types
export const {
  useKeysetInfiniteQuery,
  useMutation,
  useOffsetInfiniteQuery,
  useQuery,
  usePrefetchKeysetInfiniteQuery,
  usePrefetchOffsetInfiniteQuery,
  usePrefetchQuery,
  useQueryClient,
} = createApiUtils<ProjectQueryKeys, ERROR_KEYS>()

// Export typed result types
export type ApiResult<T> = ApiUtilsApiResult<T, ERROR_KEYS>
export type OffsetPaginationResult<T> = ApiUtilsOffsetPaginationResult<T, ERROR_KEYS>
export type KeysetPaginationResult<T> = ApiUtilsKeysetPaginationResult<T, ERROR_KEYS>
```

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
    queryFn: async (options: { body: ContactCreateForm }) => {
      return await ContactService.create(options.body)
    },
    queryKeysToInvalidate: {
      contactList: {}, // Invalidate all contactList queries after success
    },
  })
}
```

Every mutation should list which queries to invalidate via `queryKeysToInvalidate`.

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
      Error: {{ result.getError().detail }}
    </div>
    <button @click="refetch">Retry</button>
  </div>
</template>
```

All queries and mutations return `AsyncResult` with three states: loading, ok, and err.

## You're all set!

You now have:
- ✅ Plugin initialized with Vue Query
- ✅ Query keys defined with types
- ✅ API composables created
- ✅ Error codes enumerated

Head to [writing-queries](../writing-queries/SKILL.md) to fetch your first resource, or [handling-asyncresult-types](../asyncresult-handling/SKILL.md) to understand the three-state AsyncResult type.
