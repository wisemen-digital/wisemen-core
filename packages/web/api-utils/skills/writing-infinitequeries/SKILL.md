---
name: writing-infinitequeries
description: >
  Infinite pagination with useOffsetInfiniteQuery and useKeysetInfiniteQuery, offset vs keyset strategies determined by backend API, fetchNextPage, hasNextPage, isFetchingNextPage, data/meta result structure, proper page assembly.
type: core
library: vue-core-api-utils
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

## Backend API Strategy

> Offset vs keyset pagination depends entirely on your backend endpoint. Use the strategy your API provides.
>
> — Maintainer guidance

If your API provides `page` and `limit` parameters, use `useOffsetInfiniteQuery`.
If your API provides a `cursor` parameter, use `useKeysetInfiniteQuery`.

## See Also

- [Writing Queries](../writing-queries/SKILL.md) — Infinite queries are queries; all query concepts apply
