---
name: writing-queries
description: >
  Single resource queries using factory-provided useQuery, computed ref params, staleTime configuration, queryFn, refetch, isFetching vs isLoading distinctions, automatic cache management.
type: core
library: vue-core-api-utils
---

# @wisemen/vue-core-api-utils — Writing Queries

Fetch single resources with automatic caching, parameter reactivity, and configurable staleness.

## Setup

```typescript
import { computed } from 'vue'
import { useQuery } from '@/api'
import { ContactService } from '@/services'

export function useContactDetail(contactUuid: string) {
  return useQuery('contactDetail', {
    params: { contactUuid: computed(() => contactUuid) },
    queryFn: () => ContactService.getByUuid(contactUuid),
    staleTime: 1000 * 60 * 5, // 5 minutes
  })
}
```

The `params` object must contain computed refs so the query automatically refetches when params change.

## Core Patterns

### Query with reactive parameters

```typescript
import { computed, ref } from 'vue'
import { useQuery } from '@/api'

const contactUuid = ref('123')

const { result, refetch } = useQuery('contactDetail', {
  params: {
    contactUuid: computed(() => contactUuid.value), // Computed so query watches it
  },
  queryFn: () => ContactService.getByUuid(contactUuid.value),
  staleTime: 1000 * 60 * 5,
})

// When contactUuid.value changes, the query automatically refetches
contactUuid.value = '456'
```

Parameters must be computed refs. If you pass a plain ref, the query doesn't watch changes.

### Set cache expiry with staleTime

```typescript
// Cache is fresh for 5 minutes — no background refetch
const { result } = useQuery('contactDetail', {
  params: { contactUuid: computed(() => '123') },
  queryFn: () => ContactService.getByUuid('123'),
  staleTime: 1000 * 60 * 5, // 5 minutes = 300 seconds
})

// Default staleTime is 0 — cache immediately becomes stale
// Combine with global defaults in apiUtilsPlugin config
```

`staleTime` determines how long cached data is considered fresh. After this time, the next query interaction triggers a background refetch.

### Manually refetch on demand

```typescript
const { result, refetch } = useQuery('contactDetail', {
  params: { contactUuid: computed(() => '123') },
  queryFn: () => ContactService.getByUuid('123'),
})

// Manually trigger a new fetch
await refetch()

// After refetch completes, result contains new data
if (result.value.isOk()) {
  console.log(result.value.getValue())
}
```

## See Also

- [Cache Management](../cache-management/SKILL.md) — Understanding caching strategy informs staleTime choices
- [Writing Infinite Queries](../writing-infinitequeries/SKILL.md) — Pagination uses the same patterns
