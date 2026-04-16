---
name: writing-infinitequeries
description: >
  Infinite pagination with useOffsetInfiniteQuery and useKeysetInfiniteQuery, offset vs keyset strategies determined by backend API, fetchNextPage, hasNextPage, isFetchingNextPage, data/meta result structure, proper page assembly.
type: core
library: vue-core-api-utils
library_version: "0.0.3"
sources:
  - "wisemen-digital/wisemen-core:docs/packages/api-utils/pages/usage/paginated-query.md"
  - "wisemen-digital/wisemen-core:packages/web/api-utils/src/composables/query/offsetInfiniteQuery.composable.ts"
  - "wisemen-digital/wisemen-core:packages/web/api-utils/src/composables/query/keysetInfiniteQuery.composable.ts"
subsystems:
  - "Offset Pagination"
  - "Keyset Pagination"
---

# @wisemen/vue-core-api-utils — Writing Infinite Queries

Paginate through large datasets with two strategies: offset-based (page/limit) for traditional pagination, or keyset-based (cursor) for real-time data and large datasets.

**Choose your strategy based on what your backend API provides — not preference.**

## Setup

### Offset Pagination (page-based)

```typescript
import { ref, computed } from 'vue'
import { useOffsetInfiniteQuery } from '@/api'
import { ContactService } from '@/services'

export function useContactList() {
  const search = ref('')

  return useOffsetInfiniteQuery('contactList', {
    params: {
      search: computed(() => search.value),
    },
    queryFn: (pagination) => ContactService.getAll({
      page: pagination.pageParam,
      limit: pagination.limit,
      search: search.value,
    }),
  })
}
```

Pagination parameter `pageParam` starts at 0 and increments. Return results with `{ data: Contact[], meta: { page, limit, total } }`.

### Keyset Pagination (cursor-based)

```typescript
import { ref, computed } from 'vue'
import { useKeysetInfiniteQuery } from '@/api'
import { ContactService } from '@/services'

export function useContactListKeyset() {
  const search = ref('')

  return useKeysetInfiniteQuery('contactListKeyset', {
    params: {
      search: computed(() => search.value),
    },
    queryFn: (pagination) => ContactService.getAllKeyset({
      limit: pagination.limit,
      cursor: pagination.pageParam,
      search: search.value,
    }),
  })
}
```

Pagination parameter `pageParam` is a cursor (string). Return results with `{ data: Contact[], meta: { next?: string } }` — the next cursor or undefined if no more pages.

## Core Patterns

### Load and display paginated data

```typescript
import { computed } from 'vue'
import { useContactList } from '@/composables'

const { result, isFetching, fetchNextPage, hasNextPage } = useContactList()

const contacts = computed(() => {
  if (result.value.isOk()) {
    return result.value.getValue().data
  }
  return []
})
```

All pages are automatically concatenated into `data`. Access with `result.getValue().data`.

### Load next page

```vue
<button
  @click="fetchNextPage"
  :disabled="isFetchingNextPage || !hasNextPage"
>
  {{ isFetchingNextPage ? 'Loading...' : 'Load More' }}
</button>
```

Use `isFetchingNextPage` (not `isFetching`) to disable the load-more button only during pagination, not during initial load.

## Common Mistakes

### CRITICAL: Import useInfiniteQuery from @tanstack/vue-query instead of factory

```typescript
// ❌ Wrong: using TanStack directly
import { useInfiniteQuery } from '@tanstack/vue-query'

const { data, error } = useInfiniteQuery({
  queryKey: ['contactList'],
  queryFn: ({ pageParam = 0 }) => ContactService.getAll({ page: pageParam }),
  getNextPageParam: (lastPage) => lastPage.nextPage,
})
// Loses AsyncResult, type safety, error codes
```

```typescript
// ✅ Correct: use factory composable
import { useOffsetInfiniteQuery } from '@/api'

const { result, fetchNextPage, hasNextPage } = useOffsetInfiniteQuery('contactList', {
  params: { search: computed(() => '...') },
  queryFn: (pagination) => ContactService.getAll({
    page: pagination.pageParam,
    limit: pagination.limit,
  }),
})
// Full AsyncResult wrapping, type safety, automatic error codes
```

Direct TanStack import loses the factory's type safety, AsyncResult wrapping, and error code typing.

Source: Library architecture — always use composables from `createApiUtils()` factory

### CRITICAL: Return paginated data without wrapping in data/meta structure

```typescript
// ❌ Wrong: returning array directly
queryFn: (pagination) => ContactService.getAll({
  page: pagination.pageParam,
  limit: pagination.limit,
})
// Returns Contact[] directly instead of { data: Contact[], meta: {...} }
// QueryClient doesn't know how to append pages; pages overwrite instead of concat
```

```typescript
// ✅ Correct: return { data, meta } structure
queryFn: (pagination) => ContactService.getAll({
  page: pagination.pageParam,
  limit: pagination.limit,
}).then(data => ({
  data,
  meta: {
    page: pagination.pageParam,
    limit: pagination.limit,
    total: 100, // Total count if available
  }
}))
// QueryClient knows how to append pages
```

Pagination requires the library to know which part of the response is the data array and which part is pagination metadata. Return an object with `data` (array) and `meta` (metadata).

Source: `docs/packages/api-utils/pages/usage/paginated-query.md` Handling Pagination Results

### HIGH: Mix offset and keyset pagination patterns in same query

```typescript
// ❌ Wrong: mixing pagination patterns
const { result } = useOffsetInfiniteQuery('contactList', {
  queryFn: (pagination) => ContactService.getAllKeyset({
    cursor: pagination.pageParam, // offset expects page number!
    limit: pagination.limit,
  }),
})
```

```typescript
// ✅ Correct: match composable to backend API
// Use useOffsetInfiniteQuery for page/limit APIs:
const { result } = useOffsetInfiniteQuery('contactList', {
  queryFn: (pagination) => ContactService.getAll({
    page: pagination.pageParam,
    limit: pagination.limit,
  }),
})

// Use useKeysetInfiniteQuery for cursor-based APIs:
const { result } = useKeysetInfiniteQuery('contactList', {
  queryFn: (pagination) => ContactService.getAllKeyset({
    cursor: pagination.pageParam,
    limit: pagination.limit,
  }),
})
```

Each composable expects a specific pagination parameter type. Offset expects a number; keyset expects a cursor string. Choose the right composable for your backend API.

Source: `docs/packages/api-utils/pages/usage/paginated-query.md` Offset vs Keyset comparison

### MEDIUM: Forget isFetchingNextPage flag; show loading on first page load

```typescript
// ❌ Wrong: using isFetching on load-more button
const { result, isFetching, fetchNextPage } = useOffsetInfiniteQuery(...)
<button @click="fetchNextPage" :disabled="isFetching">
  {{ isFetching ? 'Loading...' : 'Load More' }}
</button>
// Button disabled on initial load too!
```

```typescript
// ✅ Correct: use isFetchingNextPage for pagination button
const { result, isFetchingNextPage, fetchNextPage } = useOffsetInfiniteQuery(...)
<button @click="fetchNextPage" :disabled="isFetchingNextPage">
  {{ isFetchingNextPage ? 'Loading...' : 'Load More' }}
</button>
```

`isFetching` is true during initial load and when fetching next pages. `isFetchingNextPage` is true only when loading additional pages. Use `isFetchingNextPage` for the load-more button.

Source: `docs/packages/api-utils/pages/usage/paginated-query.md` Return Values

## Backend API Strategy

> Offset vs keyset pagination depends entirely on your backend endpoint. Use the strategy your API provides.
>
> — Maintainer guidance

If your API provides `page` and `limit` parameters, use `useOffsetInfiniteQuery`.
If your API provides a `cursor` parameter, use `useKeysetInfiniteQuery`.

## See Also

- [Writing Queries](../writing-queries/SKILL.md) — Infinite queries are queries; all query concepts apply
