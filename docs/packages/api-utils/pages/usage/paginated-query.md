# Paginated Query with Infinite Scroll

This example demonstrates how to use `useOffsetInfiniteQuery` and `useKeysetInfiniteQuery` from `@wisemen/vue-core-api-utils` to fetch paginated data with infinite scrolling.

## Offset Pagination (Page-based)

Best for displaying traditional paginated lists where you know the total count:

```typescript
// src/composables/useContactList.ts

import { ref } from 'vue'
import { useOffsetInfiniteQuery } from '@/api'
import { ContactService } from '@/services'

export function useContactList() {
  const search = ref('')
  const sort = ref<Sort[]>([])
  const filters = ref({})

  return useOffsetInfiniteQuery('contactList', {
    params: {
      search: computed(() => search.value),
      sort: computed(() => sort.value),
      filters: computed(() => filters.value),
    },
    queryFn: (pagination) => ContactService.getAll({
      search: search.value,
      sort: sort.value,
      filters: filters.value,
      ...pagination,
    }),
  })
}
```

### Usage in Vue Component

```vue
<script setup lang="ts">
import { computed } from 'vue'
import { useContactList } from '@/composables'

const { result, isLoading, isFetching, fetchNextPage } = useContactList()

const contacts = computed(() => {
  if (result.value.isOk()) {
    return result.value.getValue().data
  }
  return []
})
</script>

<template>
  <div>
    <div v-if="isLoading" class="loading">Loading contacts...</div>
    <template v-else>
      <ul v-if="result.isOk()">
        <li v-for="contact in contacts" :key="contact.id">
          {{ contact.name }}
        </li>
      </ul>
      <div v-else-if="result.isErr()" class="error">
        Failed to load contacts: {{ result.getError().message }}
      </div>
    </template>
    <button
      @click="fetchNextPage"
      :disabled="isFetching"
      class="load-more"
    >
      {{ isFetching ? 'Loading...' : 'Load More' }}
    </button>
  </div>
</template>
```

## Keyset Pagination (Cursor-based)

Best for large datasets or real-time data where the total count is unknown:

```typescript
// src/composables/useContactListKeyset.ts

import { ref } from 'vue'
import { useKeysetInfiniteQuery } from '@/api'
import { ContactService } from '@/services'

export function useContactListKeyset() {
  const search = ref('')
  const sort = ref<Sort[]>([])

  return useKeysetInfiniteQuery('contactListKeyset', {
    params: {
      search: computed(() => search.value),
      sort: computed(() => sort.value),
    },
    queryFn: (pagination) => ContactService.getAllKeyset({
      search: search.value,
      sort: sort.value,
      ...pagination,
    }),
    limit: 20,
  })
}
```

### Usage in Vue Component

```vue
<script setup lang="ts">
import { computed } from 'vue'
import { useContactListKeyset } from '@/composables'

const { result, isFetching, fetchNextPage } = useContactListKeyset()

const contacts = computed(() => {
  if (result.value.isOk()) {
    return result.value.getValue().data
  }
  return []
})
</script>

<template>
  <div>
    <ul v-if="result.isOk()">
      <li v-for="contact in contacts" :key="contact.id">
        {{ contact.name }}
      </li>
    </ul>
    <div v-else-if="result.isErr()" class="error">
      {{ result.getError().message }}
    </div>
    <button
      @click="fetchNextPage"
      :disabled="isFetching"
    >
      {{ isFetching ? 'Loading...' : 'Load More' }}
    </button>
  </div>
</template>
```

## Return Values

- **`result`**: ComputedRef to an AsyncResult containing the paginated data
- **`isLoading`**: Whether the initial query is loading
- **`isFetching`**: Whether any fetch is in progress (including loading more pages)
- **`fetchNextPage`**: Function to load the next page of data
- **`hasNextPage`**: Whether there are more pages available
- **`isFetchingNextPage`**: Whether the next page is currently being fetched

## Handling Pagination Results

The paginated results contain both data and metadata:

```typescript
if (result.value.isOk()) {
  const paginationResult = result.value.getValue()
  
  // Access the flattened data
  const allItems = paginationResult.data
  
  // Access pagination metadata
  const metadata = paginationResult.meta
  
  // For offset pagination
  console.log(metadata.offset, metadata.limit, metadata.total)
  
  // For keyset pagination
  console.log(metadata.next) // Cursor for next page
}
```

## Best Practices

1. **Keep filters in refs** - This allows the query to automatically refetch when filters change
2. **Use computed for display** - Transform the result only when needed for rendering
3. **Handle empty results** - Show appropriate messaging when there's no data
4. **Prefetch on hover** - Use `usePrefetchOffsetInfiniteQuery` to load data before user interaction
resultData.value.match(
  (data) => {
    // Success case
    console.log('Data:', data)
  },
  (error) => {
    // Error case
    console.error('Error:', error)
  }
)
```
