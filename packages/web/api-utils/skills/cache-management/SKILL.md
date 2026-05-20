---
name: cache-management
description: >
  Type-safe QueryClient class with get/set/update/invalidate methods, rollback support from update(), predicate-based updates, cascade invalidation strategy, shared cache across components.
type: core
library: vue-core-api-utils
library_version: "1.2.0"
sources:
  - "wisemen-digital/wisemen-core:packages/web/api-utils/src/utils/query-client/queryClient.ts"
  - "wisemen-digital/wisemen-core:packages/web/api-utils/src/config/config.ts"
---

# @wisemen/vue-core-api-utils — Cache Management

Manually read, write, update, and invalidate the query cache using the type-safe `QueryClient` class. This is useful for optimistic updates and strategically invalidating affected queries.

## Setup

The library exports a `QueryClient` class that wraps the underlying TanStack QueryClient with type-safe methods. Create a helper function in your project to get a typed instance:

```typescript
// src/api/queryClient.ts

import { QueryClient, getTanstackQueryClient } from '@wisemen/vue-core-api-utils'
import type { ProjectQueryKeys } from '@/types/queryKey.type'

export function useQueryClient() {
  return new QueryClient<ProjectQueryKeys>(getTanstackQueryClient())
}
```

Then use it anywhere in your composables or components:

```typescript
import { useQueryClient } from '@/api/queryClient'

const queryClient = useQueryClient()

// Get cached data
const contacts = queryClient.get('contactDetail')

// Set cached data
queryClient.set(
  ['contactDetail', { contactUuid: '123' }],
  updatedContact
)

// Update cached data with a predicate (returns rollback function)
const { rollback } = queryClient.update('contactList', {
  by: (contact) => contact.id === '123',
  value: (contact) => ({ ...contact, name: 'Updated' }),
})

// Invalidate queries (trigger refetch)
await queryClient.invalidate('contactList')
```

## Core Patterns

### Get cached data

```typescript
const queryClient = useQueryClient()

// Get all queries with a key (returns array)
const allContacts = queryClient.get('contactDetail')

// Get exact query stored as ['contactDetail']
const exactContact = queryClient.get('contactDetail', { isExact: true })

// Get specific query with params (returns single item or null)
const contact = queryClient.get(['contactDetail', { contactUuid: '123' }] as const)
```

Returns the cached entity or null if not cached. The QueryClient infers the entity type from your query key definition.

### Set cached data

```typescript
const queryClient = useQueryClient()

// Set query with key + params
queryClient.set(
  ['contactDetail', { contactUuid: '123' }],
  { uuid: '123', name: 'John', email: 'john@email.com' }
)

// Set query with just the key (stores as ['contactDetail'])
queryClient.set('contactDetail', { uuid: '123', name: 'John', email: 'john@email.com' })
```

`set()` replaces all cached data for that specific query key.

### Update cached data with predicates

```typescript
const queryClient = useQueryClient()

// Update a single item in a list — returns { rollback } for reverting
const { rollback } = queryClient.update('contactList', {
  by: (contact) => contact.id === '123',        // Predicate
  value: (contact) => ({                        // Transform
    ...contact,
    name: 'Updated John'
  }),
})

// If the operation should be reverted (e.g. mutation failed):
rollback()
```

`update()` returns a `{ rollback }` function that reverts the cache to its state before the update. Safe to call multiple times (subsequent calls are no-ops).

### Update specific query with params tuple

```typescript
const queryClient = useQueryClient()

// Update only the specific cached query for this contact
queryClient.update(['contactDetail', { contactUuid: '123' }] as const, {
  by: () => true, // Single entity — always matches
  value: (contact) => ({ ...contact, name: 'Updated' }),
})
```

Using a key+params tuple updates only the specific query, not all queries with that key.

### Invalidate and refetch

```typescript
const queryClient = useQueryClient()

// Invalidate all queries with this key
await queryClient.invalidate('contactList')

// Invalidate specific query with params
await queryClient.invalidate(['contactDetail', { contactUuid: '123' }] as const)

// After invalidation, the next query interaction triggers a refetch
```

Invalidation marks cached data as stale. The next interaction (component mount, user action) triggers a refetch.

## Common Mistakes

### HIGH: Create QueryClient without typed query keys; lose type safety

```typescript
// ❌ Wrong: untyped QueryClient
import { QueryClient, getTanstackQueryClient } from '@wisemen/vue-core-api-utils'

const queryClient = new QueryClient(getTanstackQueryClient())
// All methods fall back to `object` for query keys — no autocomplete, no type checking
```

```typescript
// ✅ Correct: typed QueryClient
import { QueryClient, getTanstackQueryClient } from '@wisemen/vue-core-api-utils'
import type { ProjectQueryKeys } from '@/types/queryKey.type'

const queryClient = new QueryClient<ProjectQueryKeys>(getTanstackQueryClient())
// queryClient.get('nonExistentKey') → TypeScript error
// queryClient.update('contactList', { by: (c) => c.nonExistentField }) → TypeScript error
```

Always provide your `ProjectQueryKeys` type generic when instantiating QueryClient.

Source: `src/utils/query-client/queryClient.ts` — `QueryClient<TQueryKeys>` class

### HIGH: Discard the rollback return from update(); can't revert optimistic changes

```typescript
// ❌ Wrong: ignoring rollback
queryClient.update('contactList', {
  by: (c) => c.id === '123',
  value: (c) => ({ ...c, name: 'Updated' }),
})
// No way to undo if the mutation fails
```

```typescript
// ✅ Correct: capture rollback for error recovery
const { rollback } = queryClient.update('contactList', {
  by: (c) => c.id === '123',
  value: (c) => ({ ...c, name: 'Updated' }),
})

const result = await execute(formData)
if (result.isErr()) {
  rollback() // Reverts the cache to its pre-update state
}
```

`update()` returns `{ rollback }` — always capture it when doing optimistic updates so you can revert on error.

Source: `src/utils/query-client/queryClient.ts` — `QueryClientUpdateResult`

### MEDIUM: Call set() without rollback plan; UI flashes stale data on error

```typescript
// ❌ Wrong: immediate set without error recovery
queryClient.set(['contactDetail', { contactUuid }], newData)
// Cache updated but if the mutation fails, data is wrong with no way to revert
```

```typescript
// ✅ Correct: prefer update() which has built-in rollback
const { rollback } = queryClient.update(['contactDetail', { contactUuid }] as const, {
  by: () => true,
  value: () => newData,
})

const result = await execute(formData)
if (result.isErr()) {
  rollback()
}
```

Prefer `update()` over `set()` for optimistic changes because `update()` automatically captures the previous state for rollback.

Source: `src/utils/query-client/queryClient.ts`

## Cache Strategy

> Explicitly invalidate only the queries affected by the mutation. Let lazy refetch handle the rest when users navigate to pages needing other data.

When a mutation succeeds, look at what changed:
- If you updated a contact, invalidate `contactDetail` and `contactList` (they both show that contact)
- If you archived a conversation, invalidate `conversationList` (but maybe not `conversationDetail` unless it's the one you archived)
- Don't invalidate unrelated queries — let them refetch lazily when needed

## Shared Cache Across Components

Multiple components using the same query key share the same cached data. This is a feature, not a bug.

```typescript
// ComponentA
const { result: resultA } = useQuery('userDetail', {
  params: { id: computed(() => 'same-id') },
  queryFn: () => UserService.getById('same-id'),
})

// ComponentB
const { result: resultB } = useQuery('userDetail', {
  params: { id: computed(() => 'same-id') },
  queryFn: () => UserService.getById('same-id'),
})

// resultA and resultB share the SAME cached value
// Mutation in B that invalidates userDetail also triggers a refetch in A
```

Use this to your advantage: invalidate a query and all components using it refetch automatically.

## See Also

- [Writing Mutations](../writing-mutations/SKILL.md) — Every mutation needs to know which queries to invalidate
- [Writing Queries](../writing-queries/SKILL.md) — Understanding caching strategy informs cache management choices
- [Optimistic UIs](../optimistic-uis/SKILL.md) — Full optimistic update pattern using update() and rollback
