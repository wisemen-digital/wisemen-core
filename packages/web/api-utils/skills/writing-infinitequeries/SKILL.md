---
name: writing-infinitequeries
description: >
  Infinite pagination with useOffsetInfiniteQuery and useKeysetInfiniteQuery, offset vs keyset strategies determined by backend API, fetchNextPage, hasNextPage, isFetchingNextPage, data/meta result structure, proper page assembly.
type: core
library: vue-core-api-utils
library_version: "1.2.0"
sources:
  - "wisemen-digital/wisemen-core:packages/web/api-utils/src/composables/query/offsetInfiniteQuery.composable.ts"
  - "wisemen-digital/wisemen-core:packages/web/api-utils/src/composables/query/keysetInfiniteQuery.composable.ts"
  - "wisemen-digital/wisemen-core:packages/web/api-utils/src/types/pagination.type.ts"
subsystems:
  - "Offset Pagination"
  - "Keyset Pagination"
---

# @wisemen/vue-core-api-utils — Writing Infinite Queries

Paginate through large datasets with two strategies: offset-based (offset/limit) for traditional pagination, or keyset-based (cursor key) for real-time data and large datasets.

**Choose your strategy based on what your backend API provides — not preference.**

## Setup

### Offset Pagination (offset/limit-based)

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
      offset: pagination.offset,
      limit: pagination.limit,
      search: search.value,
    }),
  })
}
```

The `queryFn` receives `{ offset: number, limit: number }`. Offset starts at 0 and advances by `limit` for each next page. Return results with `{ data: Contact[], meta: { offset, limit, total } }`.

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
      key: pagination.key,
      search: search.value,
    }),
  })
}
```

The `queryFn` receives `{ key?: any, limit: number }`. The `key` is the cursor value from the previous page's `meta.next`, or `undefined` for the first page. Return results with `{ data: Contact[], meta: { next: unknown } }` — set `meta.next` to `null`/`undefined` when there are no more pages.

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

### Custom page limit

```typescript
useOffsetInfiniteQuery('contactList', {
  params: { search: computed(() => search.value) },
  limit: 50, // Default is 20
  queryFn: (pagination) => ContactService.getAll({
    offset: pagination.offset,
    limit: pagination.limit,
  }),
})
```

Pass `limit` as a top-level option to override the default page size (20).

## Response Structures

### Offset pagination response

Your `queryFn` must return:
```typescript
{
  data: Contact[],
  meta: {
    offset: number,  // Current offset
    limit: number,   // Items per page
    total: number,   // Total items across all pages
  }
}
```

The library uses `meta.offset + meta.limit >= meta.total` to determine if there are more pages.

### Keyset pagination response

Your `queryFn` must return:
```typescript
{
  data: Contact[],
  meta: {
    next: unknown, // Cursor for the next page; null/undefined if no more pages
  }
}
```

The library uses `meta.next` as the `key` parameter for the subsequent page fetch.

## Common Mistakes

### CRITICAL: Import useInfiniteQuery from @tanstack/vue-query instead of your api module

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
// ✅ Correct: use the composable from your api module
import { useOffsetInfiniteQuery } from '@/api'

const { result, fetchNextPage, hasNextPage } = useOffsetInfiniteQuery('contactList', {
  params: { search: computed(() => '...') },
  queryFn: (pagination) => ContactService.getAll({
    offset: pagination.offset,
    limit: pagination.limit,
  }),
})
// Full AsyncResult wrapping, type safety, automatic error codes
```

Source: `src/composables/query/offsetInfiniteQuery.composable.ts`

### CRITICAL: Return paginated data without wrapping in data/meta structure

```typescript
// ❌ Wrong: returning array directly
queryFn: (pagination) => ContactService.getAll({
  offset: pagination.offset,
  limit: pagination.limit,
})
// Returns Contact[] directly instead of { data: Contact[], meta: { offset, limit, total } }
// Library can't determine if there are more pages — infinite loop or stops too early
```

```typescript
// ✅ Correct: return { data, meta } structure
queryFn: (pagination) => ContactService.getAll({
  offset: pagination.offset,
  limit: pagination.limit,
})
// Where ContactService.getAll already returns { data: Contact[], meta: { offset, limit, total } }
```

The library requires the `{ data, meta }` shape to know how to concatenate pages and when to stop.

Source: `src/types/pagination.type.ts` — `OffsetPaginationResponse`

### HIGH: Use pageParam or cursor instead of offset/key

```typescript
// ❌ Wrong: using old pageParam naming
queryFn: (pagination) => ContactService.getAll({
  page: pagination.pageParam, // pageParam doesn't exist!
  cursor: pagination.cursor,  // cursor doesn't exist!
})
```

```typescript
// ✅ Correct: use offset for offset pagination, key for keyset
// Offset:
queryFn: (pagination) => ContactService.getAll({
  offset: pagination.offset, // OffsetPaginationParams.offset
  limit: pagination.limit,
})

// Keyset:
queryFn: (pagination) => ContactService.getAllKeyset({
  key: pagination.key, // KeysetPaginationParams.key
  limit: pagination.limit,
})
```

`OffsetPaginationParams` has `{ offset: number, limit: number }`.
`KeysetPaginationParams` has `{ key?: any, limit: number }`.

Source: `src/types/pagination.type.ts`

### HIGH: Mix offset and keyset pagination patterns in same query

```typescript
// ❌ Wrong: mixing pagination patterns
const { result } = useOffsetInfiniteQuery('contactList', {
  queryFn: (pagination) => ContactService.getAllKeyset({
    key: pagination.key, // offset composable doesn't have key!
    limit: pagination.limit,
  }),
})
```

```typescript
// ✅ Correct: match composable to backend API
// Use useOffsetInfiniteQuery for offset/limit APIs:
const { result } = useOffsetInfiniteQuery('contactList', {
  queryFn: (pagination) => ContactService.getAll({
    offset: pagination.offset,
    limit: pagination.limit,
  }),
})

// Use useKeysetInfiniteQuery for cursor-based APIs:
const { result } = useKeysetInfiniteQuery('contactListKeyset', {
  queryFn: (pagination) => ContactService.getAllKeyset({
    key: pagination.key,
    limit: pagination.limit,
  }),
})
```

Each composable expects a specific pagination parameter type. Choose the right composable for your backend API.

Source: `src/composables/query/offsetInfiniteQuery.composable.ts` and `keysetInfiniteQuery.composable.ts`

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

`isFetching` is true during initial load and when fetching next pages. `isFetchingNextPage` is true only when loading additional pages.

Source: `src/composables/query/offsetInfiniteQuery.composable.ts` — `UseOffsetInfiniteQueryReturnType`

## Backend API Strategy

> Offset vs keyset pagination depends entirely on your backend endpoint. Use the strategy your API provides.

If your API accepts `offset` and `limit` parameters, use `useOffsetInfiniteQuery`.
If your API accepts a cursor `key` parameter, use `useKeysetInfiniteQuery`.

## See Also

- [Writing Queries](../writing-queries/SKILL.md) — Infinite queries are queries; all query concepts apply
