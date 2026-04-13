# AsyncResult Type

## What is AsyncResult?

`AsyncResult<T, E>` is a type-safe way to handle async operations that can be in one of three states:

- **Loading**: The request is in flight
- **Ok**: The request succeeded with a value of type `T`
- **Err**: The request failed with an error of type `E`

This replaces the need for separate `isLoading`, `data`, and `error` states across your application.

```typescript
import type { AsyncResult } from '@wisemen/vue-core-api-utils'

type ApiError = {
  code: string
  message: string
}

// A query for user data
type UserAsyncResult = AsyncResult<User, ApiError>

// This can be:
// - Loading (request in progress)
// - Ok(user: User) (request succeeded)
// - Err(error: ApiError) (request failed)
```

## The Three States

### Loading State

The request is in flight:

```typescript
const result = useQuery('userDetail', {
  params: { userId: computed(() => '123') },
  queryFn: () => UserService.getById('123'),
})

if (result.value.isLoading()) {
  // Show loading spinner
}
```

### Success State

The request succeeded:

```typescript
if (result.value.isOk()) {
  const user = result.value.getValue()
  // user is typed as User
  console.log(user.name)
}
```

### Error State

The request failed:

```typescript
if (result.value.isErr()) {
  const error = result.value.getError()
  // error is typed as ApiError
  console.log(error.message)
}
```

## Why AsyncResult?

### Problems with Traditional State Management

```typescript
// ❌ Multiple separate states - easy to get inconsistent
const isLoading = ref(false)
const data = ref<User | null>(null)
const error = ref<Error | null>(null)

// Can you have both data AND error? What if loading is true but data exists?
// The type system doesn't prevent invalid state combinations
```

### AsyncResult Solution

```typescript
// ✅ Single state - impossible to get inconsistent
const result = useQuery('userDetail', {
  queryFn: () => UserService.getById('123'),
})

// result.value is ALWAYS in exactly one valid state
// The type system enforces this
```

## Using AsyncResult in Vue Components

### Simple Pattern Matching

```vue
<script setup lang="ts">
import { useQuery } from '@/api'
import { UserService } from '@/services'

const { result } = useQuery('userDetail', {
  params: { userId: computed(() => props.userId) },
  queryFn: () => UserService.getById(props.userId),
})
</script>

<template>
  <div>
    <!-- Loading state -->
    <div v-if="result.isLoading()" class="spinner">
      Loading...
    </div>

    <!-- Success state -->
    <div v-else-if="result.isOk()" class="user-card">
      <h1>{{ result.getValue().name }}</h1>
      <p>{{ result.getValue().email }}</p>
    </div>

    <!-- Error state -->
    <div v-else-if="result.isErr()" class="error-message">
      {{ result.getError().message }}
    </div>
  </div>
</template>
```

### Using `match()` for Cleaner Code

```vue
<script setup lang="ts">
import { useQuery } from '@/api'

const { result } = useQuery('userDetail', { /* ... */ })

const displayContent = computed(() => {
  return result.value.match(
    (user) => ({
      type: 'success',
      content: `Welcome, ${user.name}!`,
    }),
    (error) => ({
      type: 'error',
      content: error.message,
    }),
    () => ({
      type: 'loading',
      content: 'Loading...',
    })
  )
})
</script>

<template>
  <div :class="displayContent.type">
    {{ displayContent.content }}
  </div>
</template>
```

## Extracting Data from AsyncResult

### Getting the Success Value

```typescript
const result = useQuery('userDetail', { /* ... */ })

// Get the value (only when isOk())
if (result.value.isOk()) {
  const user = result.value.getValue()
}

// Get the value with fallback
const user = result.value.getValueOr({ name: 'Unknown' })
```

### Getting the Error

```typescript
// Get the error (only when isErr())
if (result.value.isErr()) {
  const error = result.value.getError()
  console.error(`Error ${error.code}: ${error.message}`)
}
```

## Real-World Example: User Profile Page

```typescript
// src/composables/useUserProfile.ts

import { computed } from 'vue'
import { useQuery } from '@/api'
import { UserService } from '@/services'
import type { User, ApiError } from '@/types'

export function useUserProfile(userId: string) {
  // Query returns AsyncResult<User, ApiError>
  const { result: userResult, refetch } = useQuery('userDetail', {
    params: { userId: computed(() => userId) },
    queryFn: () => UserService.getById(userId),
    staleTime: 1000 * 60 * 5,
  })

  // Computed for display logic
  const isLoading = computed(() => userResult.value.isLoading())
  const hasError = computed(() => userResult.value.isErr())
  const errorMessage = computed(() => {
    if (userResult.value.isErr()) {
      return userResult.value.getError().message
    }
    return null
  })
  const user = computed(() => {
    if (userResult.value.isOk()) {
      return userResult.value.getValue()
    }
    return null
  })

  async function updateProfile(updates: Partial<User>) {
    if (!user.value) return

    const result = await useMutation({
      queryFn: () => UserService.update(userId, updates),
    }).execute(updates)

    if (result.isOk()) {
      await refetch()
    }

    return result
  }

  return {
    isLoading,
    hasError,
    errorMessage,
    user,
    updateProfile,
  }
}
```

Component usage:

```vue
<script setup lang="ts">
import { useUserProfile } from '@/composables'

const props = defineProps<{ userId: string }>()
const { isLoading, hasError, errorMessage, user } = useUserProfile(props.userId)
</script>

<template>
  <div class="user-profile">
    <div v-if="isLoading" class="loading">
      <span>Loading profile...</span>
    </div>

    <div v-else-if="hasError" class="error">
      <p>{{ errorMessage }}</p>
      <button @click="refetch">Retry</button>
    </div>

    <div v-else-if="user" class="profile">
      <h1>{{ user.name }}</h1>
      <p>{{ user.email }}</p>
    </div>
  </div>
</template>
```

## Combining Multiple AsyncResults

### Waiting for Multiple Queries

```typescript
import { combineResults } from '@wisemen/vue-core-api-utils'

const { result: userResult } = useQuery('userDetail', { /* ... */ })
const { result: postsResult } = useQuery('userPosts', { /* ... */ })

const combined = computed(() => 
  combineResults([userResult.value, postsResult.value])
)

// combined is AsyncResult<[User, Post[]], ApiError>
// All loading states are combined
// If any fails, the error is propagated
```

## Handling Errors

### Pattern Matching on Error Types

```typescript
const result = useQuery('userDetail', { /* ... */ })

result.value.match(
  (user) => {
    console.log('Success:', user)
  },
  (error) => {
    // error is typed as ApiError
    switch (error.code) {
      case 'NOT_FOUND':
        showUserNotFoundMessage()
        break
      case 'UNAUTHORIZED':
        redirectToLogin()
        break
      case 'NETWORK_ERROR':
        showRetryButton()
        break
      default:
        showGenericErrorMessage(error.message)
    }
  },
  () => {
    console.log('Loading...')
  }
)
```

### Transforming Results

```typescript
// Transform the success value
const userNameResult = userResult.value.map(user => user.name)
// Type: AsyncResult<string, ApiError>

// Transform the error
const errorMessage = userResult.value.mapErr(error => error.message)
// Type: AsyncResult<User, string>

// Transform both
const displayText = userResult.value.match(
  (user) => `User: ${user.name}`,
  (error) => `Error: ${error.message}`,
  () => 'Loading...'
)
```

## Type Safety

AsyncResult enforces type safety at compile time:

```typescript
const result = useQuery('userDetail', { /* ... */ })

// ✅ This is safe - getValue() only works when isOk()
if (result.value.isOk()) {
  const name = result.value.getValue().name
}

// ❌ This is a type error - getValue() called when not Ok
const name = result.value.getValue().name // ERROR!

// ✅ Better - use unwrapOr() with a default
const name = result.value.unwrapOr({ name: 'Unknown' }).name
```

## Best Practices

1. **Check state before accessing data**: Always use `isOk()`, `isErr()`, or `isLoading()` before extracting data
2. **Use `match()` for complex logic**: It's cleaner and safer than multiple `if` statements
3. **Create computed properties**: Extract display logic into computed properties for reusability
4. **Handle all three states**: Don't forget the loading state in your UI
5. **Type your composables**: Return AsyncResult types from your composables for clarity
6. **Use error codes**: Define specific error codes instead of generic error messages
7. **Document what can fail**: Make it clear in your function signatures what errors can occur

## AsyncResult vs Promise

| Aspect | Promise | AsyncResult |
|--------|---------|------------|
| Error Type | Exceptions (stack loss) | Typed errors |
| State Visibility | Hidden in promise state | Explicit in type |
| Loading State | Need separate ref | Built-in |
| Type Safety | Limited error typing | Full type safety |
| Composition | `.catch()`, `.finally()` | `.map()`, `.match()` |
| Vue Integration | Works but verbose | Native reactive support |

