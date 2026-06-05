# Detail Query

This example demonstrates how to use `useQuery` and `usePrefetchQuery` from `@wisemen/vue-core-api-utils` to fetch a single resource.

## Query Definition

```typescript
// src/composables/useContactDetail.ts

import { useQuery, usePrefetchQuery } from '@/api'
import { ContactService } from '@/services'
import type { ContactUuid } from '@/types'

export function useContactDetail(contactUuid: string) {
  return useQuery('contactDetail', {
    params: { contactUuid: computed(() => contactUuid) },
    queryFn: () => ContactService.getByUuid(contactUuid),
    staleTime: 1000 * 60 * 5, // 5 minutes
  })
}

export function usePrefetchContactDetail(contactUuid: string) {
  return usePrefetchQuery('contactDetail', {
    params: { contactUuid: computed(() => contactUuid) },
    queryFn: () => ContactService.getByUuid(contactUuid),
  })
}
```

## Usage in Vue Component

### Basic Usage with Result Handling

```vue
<script setup lang="ts">
import { useContactDetail } from '@/composables'

const props = defineProps<{
  contactUuid: string
}>()

const { result, isLoading, refetch } = useContactDetail(props.contactUuid)
</script>

<template>
  <div>
    <div v-if="isLoading" class="loading">Loading contact...</div>
    <div v-else-if="result.isOk()" class="contact-detail">
      <h1>{{ result.getValue().name }}</h1>
      <p>Email: {{ result.getValue().email }}</p>
    </div>
    <div v-else-if="result.isErr()" class="error">
      <p>Failed to load contact: {{ result.getError().message }}</p>
      <button @click="refetch">Retry</button>
    </div>
  </div>
</template>
```

### Using Pattern Matching

```vue
<script setup lang="ts">
import { useContactDetail } from '@/composables'

const props = defineProps<{
  contactUuid: string
}>()

const { result, isLoading } = useContactDetail(props.contactUuid)
</script>

<template>
  <div>
    <div v-if="isLoading">Loading...</div>
    <template v-else>
      <div
        v-if="result.isOk()"
        class="contact"
      >
        <h2>{{ result.getValue().name }}</h2>
        <p>{{ result.getValue().email }}</p>
      </div>
      <div v-else-if="result.isErr()" class="error-message">
        {{ result.getError().message }}
      </div>
    </template>
  </div>
</template>
```

## Return Values

- **`result`**: `ComputedRef<AsyncResult<T, E>>` — use `result.value.isLoading()`, `.isOk()`, `.isErr()` for state checks
- **`isFetching`**: Whether data is being fetched (includes background refetches)
- **`refetch`**: Function to manually refetch the data
- **`isLoading`** _(deprecated)_: Use `result.value.isLoading()` instead
- **`isError`** _(deprecated)_: Use `result.value.isErr()` instead
- **`isSuccess`** _(deprecated)_: Use `result.value.isOk()` instead

## Error States

The `result` property makes all error states explicit and type-safe:

```typescript
if (result.value.isLoading()) {
  // Initial load in progress
}

if (result.value.isOk()) {
  const contact = result.value.getValue()
  // Contact data is fully typed
}

if (result.value.isErr()) {
  const error = result.value.getError()
  // Handle specific error codes
  if (error.code === 'NOT_FOUND') {
    // Contact doesn't exist
  }
}
```


## Prefetching Data

Prefetching is useful for loading data before it's needed, such as when hovering over a link:

```vue
<script setup lang="ts">
import { computed } from 'vue'
import { useContactDetailPrefetchQuery } from '@/modules/contact/api/queries/contactDetail.query'
import type { ContactUuid } from '@/modules/contact/models/contact/contactUuid.model'

const props = defineProps<{
  contactUuid: ContactUuid
}>()

const prefetchQuery = useContactDetailPrefetchQuery(computed(() => props.contactUuid))

function onMouseEnter() {
  // Prefetch the contact data on hover
  prefetchQuery.prefetch()
}
</script>

<template>
  <RouterLink
    :to="{ name: 'contact-detail', params: { contactUuid } }"
    @mouseenter="onMouseEnter"
  >
    View Contact
  </RouterLink>
</template>
```

## Working with Results

```typescript
// Check state before extracting values
if (result.value.isErr()) {
  console.error('Error:', result.value.getError())
} else if (result.value.isOk()) {
  console.log('Data:', result.value.getValue())
}

// Or use exhaustive pattern matching
result.value.match({
  loading: () => {
    console.log('Loading...')
  },
  ok: (data) => {
    // data is properly typed as ContactDetail
    console.log('Contact:', data)
  },
  err: (error) => {
    console.error('Error:', error)
  },
})
```
