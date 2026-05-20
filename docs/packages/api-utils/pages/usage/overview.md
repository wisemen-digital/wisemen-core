# Overview

The `@wisemen/vue-core-api-utils` package provides a set of composables built on top of TanStack Query (Vue Query) that integrate seamlessly with Vue 3 and TypeScript. All queries and mutations return `AsyncResult` types for structured error handling.

## Getting Started

Before using any composables, make sure you've completed the [installation steps](../getting-started/installation.md). Your API module should use module augmentation and re-export composables like this:

```typescript
// src/api/index.ts

import type { ProjectQueryKeys } from '@/types/queryKey.type'

export type ERROR_KEYS = 'NOT_FOUND' | 'UNAUTHORIZED' | 'SERVER_ERROR'

declare module '@wisemen/vue-core-api-utils' {
  interface Register {
    queryKeys: ProjectQueryKeys
    errorCodes: ERROR_KEYS
  }
}

export {
  useKeysetInfiniteQuery,
  useMutation,
  useOffsetInfiniteQuery,
  usePrefetchKeysetInfiniteQuery,
  usePrefetchOffsetInfiniteQuery,
  usePrefetchQuery,
  useQuery,
} from '@wisemen/vue-core-api-utils'

export type {
  ApiResult,
  KeysetPaginationResult,
  OffsetPaginationResult,
} from '@wisemen/vue-core-api-utils'
```

## Core Concepts

### AsyncResult

All queries and mutations return an `AsyncResult<T, E>` type which can be in three states:
- **Loading**: Data is being fetched
- **Ok**: Contains the successful result value
- **Err**: Contains the error

This makes handling loading, success, and error states explicit and type-safe.

```typescript
// Check result state
if (result.value.isLoading()) {
  console.log('Loading...')
} else if (result.value.isOk()) {
  console.log('Success:', result.value.getValue())
} else if (result.value.isErr()) {
  console.error('Error:', result.value.getError())
}

// Or use exhaustive pattern matching
result.value.match({
  loading: () => console.log('Loading...'),
  ok: (data) => console.log('Success:', data),
  err: (error) => console.error('Error:', error),
})
```

## Available Composables

### Queries

- **`useQuery`**: Fetch a single resource with automatic caching
- **`useOffsetInfiniteQuery`**: Fetch paginated data with offset-based pagination
- **`useKeysetInfiniteQuery`**: Fetch paginated data with keyset-based pagination
- **`usePrefetchQuery`**: Prefetch data before it's needed
- **`usePrefetchOffsetInfiniteQuery`**: Prefetch paginated data with offset pagination
- **`usePrefetchKeysetInfiniteQuery`**: Prefetch paginated data with keyset pagination

### Mutations

- **`useMutation`**: Create, update, or delete resources with automatic cache invalidation

### Cache Client

The library does not export a `useQueryClient` composable. Create a typed wrapper in `src/api/queryClient.ts`:

```typescript
import { QueryClient, getTanstackQueryClient } from '@wisemen/vue-core-api-utils'
import type { ProjectQueryKeys } from '@/types/queryKey.type'

export function useQueryClient() {
  return new QueryClient<ProjectQueryKeys>(getTanstackQueryClient())
}
```

See [Type-Safe Query Client](./query-client.md) for usage.

## Return Values

All composables return an object with:

**Queries:**
- `result`: `ComputedRef<AsyncResult<T, E>>` — the primary way to read state; use `result.value.isLoading()`, `.isOk()`, `.isErr()`
- `isFetching`: Whether data is being fetched (including background refetches)
- `refetch`: Function to manually refetch the data

**Mutations:**
- `result`: `ComputedRef<AsyncResult<T, E>>` — reactive mutation state
- `execute`: Function to trigger the mutation; returns `Promise<ApiResult<T, E>>`

## Quick Examples

### Detail Query

```typescript
// src/composables/useUser.ts

import { useQuery } from '@/api'
import { UserService } from '@/services'

export function useUserDetail(userId: string) {
  return useQuery('userDetail', {
    params: { userId: computed(() => userId) },
    queryFn: () => UserService.getById(userId),
    staleTime: 1000 * 60 * 5, // 5 minutes
  })
}
```

Usage in a component:

```vue
<script setup lang="ts">
import { useUserDetail } from '@/composables'

const props = defineProps<{ userId: string }>()

const { result, isLoading, refetch } = useUserDetail(props.userId)
</script>

<template>
  <div v-if="isLoading" class="loading">Loading user...</div>
  <div v-else-if="result.isOk()" class="user-card">
    <h1>{{ result.getValue().name }}</h1>
    <p>{{ result.getValue().email }}</p>
  </div>
  <div v-else-if="result.isErr()" class="error">
    <p>Failed to load user: {{ result.getError().message }}</p>
    <button @click="refetch">Retry</button>
  </div>
</template>
```

### Paginated List Query

```typescript
// src/composables/useUserList.ts

import { ref, computed } from 'vue'
import { useOffsetInfiniteQuery } from '@/api'
import { UserService } from '@/services'

export function useUserList() {
  const search = ref('')
  const sort = ref<Sort[]>([])
  const filters = ref({})

  return useOffsetInfiniteQuery('userList', {
    params: {
      search: computed(() => search.value),
      sort: computed(() => sort.value),
      filters: computed(() => filters.value),
    },
    queryFn: (pagination) => UserService.getAll({
      search: search.value,
      sort: sort.value,
      filters: filters.value,
      ...pagination,
    }),
  })
}
```

Usage:

```vue
<script setup lang="ts">
import { useUserList } from '@/composables'

const { result, isFetching, fetchNextPage } = useUserList()

const users = computed(() => {
  if (result.value.isOk()) {
    return result.value.getValue().data
  }
  return []
})
</script>

<template>
  <div>
    <div v-if="isFetching" class="loading">Fetching...</div>
    <ul v-else>
      <li v-for="user in users" :key="user.id">{{ user.name }}</li>
    </ul>
    <button @click="fetchNextPage" :disabled="isFetching">Load More</button>
  </div>
</template>
```

### Create Mutation

```typescript
// src/composables/useCreateUser.ts

import { useMutation } from '@/api'
import { UserService } from '@/services'

export function useCreateUser() {
  return useMutation({
    queryFn: ({ body }: { body: CreateUserRequest }) => UserService.create(body),
    queryKeysToInvalidate: {
      userList: {},
    },
  })
}
```

Usage:

```vue
<script setup lang="ts">
import { useCreateUser } from '@/composables'

const { execute, result } = useCreateUser()

async function handleSubmit(form: CreateUserRequest) {
  const mutationResult = await execute({ body: form })

  if (mutationResult.isOk()) {
    console.log('User created:', mutationResult.value)
  }
}
</script>

<template>
  <form @submit.prevent="handleSubmit">
    <!-- Form inputs -->
    <button :disabled="result.isLoading()">
      {{ result.isLoading() ? 'Creating...' : 'Create User' }}
    </button>
    <div v-if="result.isErr()" class="error">
      {{ result.getError().errors[0].detail }}
    </div>
  </form>
</template>
```

### Optimistic Updates

```typescript
// src/composables/useUpdateUser.ts

import { useMutation } from '@/api'
import { UserService } from '@/services'

export function useUpdateUser(userId: string) {
  return useMutation({
    queryFn: ({ body }: { body: UpdateUserRequest }) => UserService.update(userId, body),
    queryKeysToInvalidate: {
      userDetail: {},
      userList: {},
    },
  })
}
```

For type-safe query client operations, see the [Type-Safe Query Client](./query-client.md) guide.

## Error Handling

Errors are always returned as part of the result object, never thrown:

```typescript
const { result } = useUserDetail('123')

// Always safe - no try/catch needed
result.value.match({
  loading: () => { /* handle loading */ },
  ok: (user) => { /* handle success */ },
  err: (error) => {
    // Handle specific error types
    if ('errors' in error) {
      switch (error.errors[0].code) {
        case 'NOT_FOUND':
          console.log('User not found')
          break
        case 'UNAUTHORIZED':
          console.log('Not authorized to view this user')
          break
        default:
          console.log('Unknown error')
      }
    }
  },
})
```

## Services

Services act as an abstraction layer between your API client and your queries/mutations. They handle:
- Calling API endpoints
- Transforming data between DTOs and domain models
- Returning `ApiResult` types for error handling

### Service Example

```typescript
// src/services/user.service.ts

import { UserApi } from '@/client'
import type { ApiResult } from '@/api'

export class UserService {
  static async getById(userId: string): Promise<ApiResult<User>> {
    try {
      const response = await UserApi.getById(userId)
      return { ok: true, data: response.data }
    } catch (error) {
      return { ok: false, error: error.message }
    }
  }

  static async create(body: CreateUserRequest): Promise<ApiResult<User>> {
    try {
      const response = await UserApi.create(body)
      return { ok: true, data: response.data }
    } catch (error) {
      return { ok: false, error: error.message }
    }
  }

  static async update(userId: string, body: UpdateUserRequest): Promise<ApiResult<User>> {
    try {
      const response = await UserApi.update(userId, body)
      return { ok: true, data: response.data }
    } catch (error) {
      return { ok: false, error: error.message }
    }
  }

  static async delete(userId: string): Promise<ApiResult<void>> {
    try {
      await UserApi.delete(userId)
      return { ok: true, data: undefined }
    } catch (error) {
      return { ok: false, error: error.message }
    }
  }
}
```

## Next Steps

For more detailed information on specific topics, see:

- [Query Documentation](./query.md) - Single resource fetching with `useQuery`
- [Paginated Query Documentation](./paginated-query.md) - Paginated data with offset and keyset pagination
- [Mutation Documentation](./mutation.md) - Creating, updating, and deleting resources
- [Result Types Documentation](../concepts/result-types.md) - Understanding AsyncResult and error handling
- [Mutations Documentation](./mutation.md) - Create, update, and delete operations
## Best Practices

### 1. Always Use `result` for Error Handling

Never destructure `data` and `error` separately. Always use the `result` property:

```typescript
// ❌ BAD: Don't do this
const { data, error } = useQuery(...)
if (error.value) { ... }

// ✅ GOOD: Use result
const { result } = useQuery(...)
if (result.value.isErr()) { ... }
```

### 2. Use Pattern Matching for Result Handling

The `match` method is the most elegant way to handle all three states. All three handlers are required:

```typescript
result.value.match({
  loading: () => {
    // Loading state
  },
  ok: (data) => {
    // Success - data is fully typed
    console.log(data)
  },
  err: (error) => {
    // Error - error is fully typed
    console.error(error)
  },
})
```

Alternatively, you can use `isErr()` / `isOk()` for conditional checks:

```typescript
if (result.value.isErr()) {
  // Handle error - TypeScript knows this is an Err
  console.error(result.value.getError())
  return
}

if (result.value.isOk()) {
  // TypeScript knows result.value is Ok here
  console.log(result.value.getValue())
}
```

**Using `unwrapOr()` in Computed Properties**

For display logic in templates, you can use a computed property with the built-in `unwrapOr()` method from neverthrow to safely extract the value or return a default value on error:

```typescript
const contactData = computed(() => {
  // unwrapOr() is a neverthrow method that returns the value if Ok, or the default value if Err
  return result.value.unwrapOr(null)
})
```

```vue
<template>
  <div v-if="contactData">
    <h1>{{ contactData.firstName }} {{ contactData.lastName }}</h1>
  </div>
  <div v-else-if="result.isErr()">
    Error loading contact
  </div>
</template>
```

This pattern is useful when you want to:
- Display data only when available
- Keep template logic simple
- Avoid repetitive error checking in templates

### 3. Transform Results When Needed

For infinite queries, transform the result to a flat `ApiResult`:

```typescript
const resultData = computed<ApiResult<ContactIndex[]>>(() => {
  return result.value.map((data) => data.data)
})
```

### 4. Proper Cache Invalidation

Invalidate specific queries after mutations:

```typescript
// Invalidate all contact index queries
queryKeysToInvalidate: {
  contactIndex: {},
}

// Invalidate specific contact detail
queryKeysToInvalidate: {
  contactDetail: {
    contactUuid: (params) => params.contactUuid,
  },
}
```

## Common Patterns

### Data Provider Pattern

Use a data provider component to handle loading and error states:

```vue
<template>
  <AppDataProviderView :queries="{ contact: contactDetailQuery }">
    <template #default="{ data }">
      <ContactDetailView :contact="data.contact" />
    </template>
  </AppDataProviderView>
</template>
```

### Form with Mutation

Integrate mutations with form libraries like Formango:

```vue
<script setup lang="ts">
const mutation = useContactCreateMutation()

const form = useForm({
  schema: contactCreateFormSchema,
  onSubmit: async (values) => {
    const result = await mutation.execute({ body: values })

    result.match(
      (data) => {
        // Handle success
      },
      (error) => {
        // Handle error
      }
    )
  },
})
</script>
```

## Resources

- [TanStack Query Documentation](https://tanstack.com/query/latest/docs/vue/overview)
- [neverthrow Documentation](https://github.com/supermacro/neverthrow)
