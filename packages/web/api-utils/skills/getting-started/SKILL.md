---
name: getting-started
description: >
  Install @wisemen/vue-core-api-utils, initialize apiUtilsPlugin with QueryClient config, register typed query keys via module augmentation, re-export composables.
type: lifecycle
library: vue-core-api-utils
library_version: "1.2.0"
sources:
  - "wisemen-digital/wisemen-core:packages/web/api-utils/src/plugin/apiUtilsPlugin.ts"
  - "wisemen-digital/wisemen-core:packages/web/api-utils/src/register.ts"
  - "wisemen-digital/wisemen-core:packages/web/api-utils/src/config/config.ts"
---

# @wisemen/vue-core-api-utils — Getting Started

Get `@wisemen/vue-core-api-utils` installed, your Vue Query plugin initialized, query keys defined, and typed composables available.

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
    params: { search?: string }
  }
  
  // List query with keyset pagination
  contactListKeyset: {
    entity: Contact[]
    params: { search?: string }
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

### 4. Register your types and re-export composables

Use module augmentation to register your query keys and error codes for library-wide type safety, then re-export composables for convenient importing across your project:

```typescript
// src/api/index.ts

import type {
  ApiResult as ApiUtilsApiResult,
  KeysetPaginationResult as ApiUtilsKeysetPaginationResult,
  OffsetPaginationResult as ApiUtilsOffsetPaginationResult,
} from '@wisemen/vue-core-api-utils'

import type { ProjectQueryKeys } from '@/types/queryKey.type'

// Define your error codes
export type ERROR_KEYS = 'NOT_FOUND' | 'UNAUTHORIZED' | 'NETWORK_ERROR' | 'VALIDATION_ERROR'

// Register query keys and error codes via module augmentation
// This makes all composables fully typed without a factory function
declare module '@wisemen/vue-core-api-utils' {
  interface Register {
    queryKeys: ProjectQueryKeys
    errorCodes: ERROR_KEYS
  }
}

// Re-export composables for convenient importing
export {
  useKeysetInfiniteQuery,
  useMutation,
  useOffsetInfiniteQuery,
  useQuery,
  usePrefetchKeysetInfiniteQuery,
  usePrefetchOffsetInfiniteQuery,
  usePrefetchQuery,
} from '@wisemen/vue-core-api-utils'

// Export typed result types
export type ApiResult<T> = ApiUtilsApiResult<T, ERROR_KEYS>
export type OffsetPaginationResult<T> = ApiUtilsOffsetPaginationResult<T, ERROR_KEYS>
export type KeysetPaginationResult<T> = ApiUtilsKeysetPaginationResult<T, ERROR_KEYS>
```

The `declare module` block tells the library about your project's types. After this, every composable automatically knows your query keys and error codes.

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

## Common Mistakes

### CRITICAL: Forget to initialize apiUtilsPlugin

```typescript
// ❌ Wrong: plugin not initialized
const app = createApp(App)
app.mount('#app')
// Throws: "[api-utils] QueryClient not available..."
```

```typescript
// ✅ Correct: plugin initialized with config
const app = createApp(App)
app.use(apiUtilsPlugin({
  defaultOptions: {
    queries: { staleTime: 1000 * 60 * 5 },
  },
}))
app.mount('#app')
```

Without the plugin, composables have no QueryClient and throw immediately.

Source: `src/config/config.ts` — `getQueryClient()` assertion

### HIGH: Define query keys interface without strict entity/params structure

```typescript
// ❌ Wrong: inconsistent structure
export interface ProjectQueryKeys {
  contactDetail: { entity: Contact } // Missing params!
  contactList: Contact[] // Should wrap in { entity, params }
}
```

```typescript
// ✅ Correct: every key has entity and params
export interface ProjectQueryKeys {
  contactDetail: {
    entity: Contact
    params: { contactUuid: string }
  }
  contactList: {
    entity: Contact[]
    params: { search?: string }
  }
}
```

Query keys without proper structure cause TypeScript errors and prevent correct query key resolution.

Source: `src/register.ts` — `RegisteredQueryKeyEntity` and `RegisteredQueryKeyParams` type derivation

### HIGH: Skip the module augmentation; composables lose type safety

```typescript
// ❌ Wrong: no declare module block in @/api/index.ts
// Composables fall back to `object` for query keys and `string` for error codes
// TypeScript won't catch wrong query key names or invalid error codes
```

```typescript
// ✅ Correct: declare module augments the Register interface
declare module '@wisemen/vue-core-api-utils' {
  interface Register {
    queryKeys: ProjectQueryKeys
    errorCodes: ERROR_KEYS
  }
}
// Now useQuery('nonExistentKey', ...) is a compile error
// And error.code is typed as ERROR_KEYS, not just string
```

Without the `declare module` block the library types fall back to generic `object` and `string`. All query key checks and error code checks become useless at compile time.

Source: `src/register.ts`

## You're all set!

You now have:
- ✅ Plugin initialized with Vue Query
- ✅ Query keys defined with types
- ✅ Types registered via module augmentation
- ✅ Composables re-exported from `@/api`
- ✅ Error codes enumerated

Head to [writing-queries](../writing-queries/SKILL.md) to fetch your first resource, or [asyncresult-handling](../asyncresult-handling/SKILL.md) to understand the three-state AsyncResult type.
