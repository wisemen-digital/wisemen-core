---
name: writing-queries
description: >
  Single resource queries using useQuery, computed ref params, staleTime configuration, queryFn, refetch, isFetching vs isLoading distinctions, automatic cache management.
type: core
library: vue-core-api-utils
library_version: "1.2.0"
sources:
  - "wisemen-digital/wisemen-core:packages/web/api-utils/src/composables/query/query.composable.ts"
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

### Conditionally enable a query

```typescript
const isEnabled = computed(() => contactUuid.value !== null)

const { result } = useQuery('contactDetail', {
  params: { contactUuid: computed(() => contactUuid.value!) },
  queryFn: () => ContactService.getByUuid(contactUuid.value!),
  isEnabled,
})
```

Use `isEnabled` to prevent the query from running until required data is available.

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

## Common Mistakes

### CRITICAL: Import useQuery from @tanstack/vue-query instead of your api module

```typescript
// ❌ Wrong: using TanStack directly
import { useQuery } from '@tanstack/vue-query'

const { data, error, isLoading } = useQuery({
  queryKey: ['contactDetail', '123'],
  queryFn: () => ContactService.getByUuid('123'),
})
// Loses AsyncResult wrapping, type safety, error code typing
```

```typescript
// ✅ Correct: use the composable from your api module (or directly from the library)
import { useQuery } from '@/api'
import { computed } from 'vue'

const { result, isLoading } = useQuery('contactDetail', {
  params: { contactUuid: computed(() => '123') },
  queryFn: () => ContactService.getByUuid('123'),
  staleTime: 1000 * 60 * 5,
})
// Full type safety, AsyncResult wrapping, automatic error codes
```

Importing directly from @tanstack/vue-query bypasses the typed composable, losing AsyncResult wrapping, type-safe query keys, and error code typing.

Source: `src/composables/query/query.composable.ts`

### HIGH: Use plain ref for params instead of computed

```typescript
// ❌ Wrong: plain ref doesn't trigger refetch
const userId = ref('123')
const { result } = useQuery('userDetail', {
  params: { userId }, // plain ref, not computed
  queryFn: () => UserService.getById(userId.value),
})
// Later: userId.value = '456'
// Query does NOT refetch — cache stays stale!
```

```typescript
// ✅ Correct: use computed so query watches changes
const userId = computed(() => props.userId)
const { result } = useQuery('userDetail', {
  params: { userId },
  queryFn: () => UserService.getById(userId.value),
})
// userId changes → computed updates → query watches → refetch happens
```

When params are plain refs, the query doesn't watch them and the cache isn't invalidated when the param changes.

Source: `src/composables/query/query.composable.ts` — `NestedMaybeRefOrGetter` type

### HIGH: Not set staleTime; background refetch on every interaction

```typescript
// ❌ Wrong: no staleTime; background refetch constantly
const { result } = useQuery('userDetail', {
  params: { userId: computed(() => '123') },
  queryFn: () => UserService.getById('123'),
  // staleTime defaults to 0 — cache is immediately stale!
})
// Every component interaction triggers a refetch
```

```typescript
// ✅ Correct: set staleTime to a reasonable value
const { result } = useQuery('userDetail', {
  params: { userId: computed(() => '123') },
  queryFn: () => UserService.getById('123'),
  staleTime: 1000 * 60 * 5, // 5 minutes
})
// Cache remains fresh for 5 minutes — background refetch only after expiry
```

Default `staleTime` is 0, meaning the cache is immediately considered stale. Every interaction triggers a background refetch. Set `staleTime` based on how frequently the data changes.

### MEDIUM: Confuse isFetching with isLoading

```typescript
// ❌ Wrong: checking isLoading for conditional render
const { result, isLoading } = useQuery(...)
if (isLoading.value) {
  return // Exits only on initial load!
}
// Code here runs while background refetch happens
```

```typescript
// ✅ Correct: use result.isLoading() for state checks
const { result } = useQuery(...)
if (result.value.isLoading()) {
  return // True only on initial load
}
// Use isFetching separately for background fetch indicator
```

`isLoading` is true only during the initial fetch. `isFetching` is true whenever any fetch is in progress (including background refetches). Use `result.isLoading()` for conditional rendering; use `isFetching` for loading indicators.

Note: `isLoading`, `isError`, and `isSuccess` on the return type are deprecated — prefer `result.value.isLoading()`, `result.value.isErr()`, and `result.value.isOk()`.

Source: `src/composables/query/query.composable.ts` — `UseQueryReturnType`

## See Also

- [Cache Management](../cache-management/SKILL.md) — Understanding caching strategy informs staleTime choices
- [Writing Infinite Queries](../writing-infinitequeries/SKILL.md) — Pagination uses the same patterns
