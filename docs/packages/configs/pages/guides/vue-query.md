# Vue Query Configuration

Tanstack Vue Query client configuration with sensible defaults and error handling.

## Basic setup

```typescript
// src/config/query.ts
import { createQueryClient } from '@tanstack/vue-query'
import { vueQueryClientConfig, setQueryOnErrorCallback } from '@wisemen/vue-core-configs'

export const queryClient = createQueryClient({
  ...vueQueryClientConfig(),
})

// Optional: Set up global error handler
setQueryOnErrorCallback((error) => {
  console.error('API request failed:', error)
  // Show toast notification, redirect to login, etc.
})
```

## Install in your app

```typescript
// src/main.ts
import { createApp } from 'vue'
import { VueQueryPlugin } from '@tanstack/vue-query'
import App from './App.vue'
import { queryClient } from './config/query'

const app = createApp(App)

app.use(VueQueryPlugin, { queryClient })
app.mount('#app')
```

## Default configuration

The configuration provides:

- **Query Cache**: Intelligent caching with error handling
- **Default Retry**: No automatic retries on failure
- **Window Focus**: Queries don't refetch on window focus
- **Error Handling**: Global error callback support

## Common patterns

### Fetch data with useQuery

```typescript
<script setup lang="ts">
import { useQuery } from '@tanstack/vue-query'
import { getUser } from '@/api'

const userId = ref('123')

const { data: user, isLoading, error } = useQuery({
  queryKey: ['user', userId.value],
  queryFn: () => getUser(userId.value),
})
</script>

<template>
  <div v-if="isLoading">Loading...</div>
  <div v-else-if="error">Error: {{ error.message }}</div>
  <div v-else>
    <p>{{ user.name }}</p>
  </div>
</template>
```

### Mutate data with useMutation

```typescript
<script setup lang="ts">
import { useMutation, useQueryClient } from '@tanstack/vue-query'
import { updateUser } from '@/api'

const queryClient = useQueryClient()

const { mutate, isPending } = useMutation({
  mutationFn: (data) => updateUser(data),
  onSuccess: () => {
    // Invalidate and refetch user queries
    queryClient.invalidateQueries({ queryKey: ['user'] })
  },
})

const onSave = (formData) => {
  mutate(formData)
}
</script>
```

### Infinite queries

```typescript
<script setup lang="ts">
import { useInfiniteQuery } from '@tanstack/vue-query'
import { getUsers } from '@/api'

const {
  data,
  fetchNextPage,
  hasNextPage,
  isFetchingNextPage,
} = useInfiniteQuery({
  queryKey: ['users'],
  queryFn: ({ pageParam = 0 }) => getUsers(pageParam),
  getNextPageParam: (lastPage) => lastPage.nextCursor,
})

const allUsers = computed(() =>
  data.value?.pages.flatMap(page => page.users) ?? [],
)
</script>

<template>
  <div>
    <div v-for="user in allUsers" :key="user.id">
      {{ user.name }}
    </div>
    <button
      v-if="hasNextPage"
      @click="fetchNextPage"
      :disabled="isFetchingNextPage"
    >
      Load more
    </button>
  </div>
</template>
```

## Override configuration

Customize the query client:

```typescript
import { vueQueryClientConfig } from '@wisemen/vue-core-configs'

export const queryClient = vueQueryClientConfig({
  defaultOptions: {
    queries: {
      gcTime: 1000 * 60 * 5,        // 5 minutes cache
      staleTime: 1000 * 60,         // 1 minute
      retry: (failureCount, error) => {
        // Custom retry logic
        if (error.status === 401) return false
        return failureCount < 2
      },
    },
    mutations: {
      retry: 1,
    },
  },
})
```

## Error handling

### Global error handler

```typescript
import { setQueryOnErrorCallback } from '@wisemen/vue-core-configs'

setQueryOnErrorCallback((error: Error) => {
  // Show error toast
  emit('show-error', error.message)
  
  // Log to error tracking service
  
  // Handle specific error types
  if (error.status === 401) {
    // Redirect to login
  }
})
```

### Per-query error handling

```typescript
const { error } = useQuery({
  queryKey: ['user'],
  queryFn: () => getUser(),
  retry: false,
  throwOnError: (error) => {
    // Only throw on specific errors
    return error.status >= 500
  },
})
```
