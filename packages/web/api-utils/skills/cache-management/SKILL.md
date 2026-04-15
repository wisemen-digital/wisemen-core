---
name: cache-management
description: >
  Type-safe QueryClient with get/set/update/invalidate methods, predicate-based updates, cascade invalidation strategy, shared cache across components, lazy refetch patterns.
type: core
library: vue-core-api-utils
library_version: "0.0.3"
sources:
  - "wisemen-digital/wisemen-core:docs/packages/api-utils/pages/usage/query-client.md"
  - "wisemen-digital/wisemen-core:packages/web/api-utils/src/utils/query-client/queryClient.ts"
  - "wisemen-digital/wisemen-core:packages/web/api-utils/src/factory/createApiQueryClientUtils.ts"
---

# @wisemen/vue-core-api-utils — Cache Management

Manually read, write, update, and invalidate the query cache using the type-safe `useQueryClient()` composable. This is useful for optimistic updates and strategically invalidating affected queries.

## Setup

```typescript
import { useQueryClient } from '@/api'

const queryClient = useQueryClient()

// Get cached data
const contact = queryClient.get(['contactDetail', { contactUuid: '123' }])

// Set cached data
queryClient.set(
  ['contactDetail', { contactUuid: '123' }],
  updatedContact
)

// Update cached data with a predicate
queryClient.update('contactList', {
  by: (contact) => contact.id === '123',
  value: (contact) => ({ ...contact, name: 'Updated' }),
})

// Invalidate queries (trigger refetch)
queryClient.invalidate('contactList')
```

## Core Patterns

### Get cached data

```typescript
const queryClient = useQueryClient()

// Get specific query
const contact = queryClient.get(
  ['contactDetail', { contactUuid: '123' }]
)

// Get all queries with a key
const allContacts = queryClient.get('contactList')

// Get exact query only
const specificQuery = queryClient.get('contactList', { isExact: true })
```

Returns the cached data or null if not cached. The QueryClient infers entity type from your query key definition.

### Set cached data

```typescript
const queryClient = useQueryClient()

queryClient.set(
  ['contactDetail', { contactUuid: '123' }],
  { id: '123', name: 'John', email: 'john@email.com' }
)

// For lists, set works with arrays too
queryClient.set('contactList', [
  { id: '123', name: 'John' },
  { id: '456', name: 'Jane' },
])
```

`set()` replaces all cached data for that query key.

### Update cached data with predicates

```typescript
const queryClient = useQueryClient()

// Update a single item in a list
queryClient.update('contactList', {
  by: (contact) => contact.id === '123',        // Predicate
  value: (contact) => ({                        // Transform
    ...contact,
    name: 'Updated John'
  }),
})

// For single entities, the predicate always matches
queryClient.update('contactDetail', {
  by: (contact) => true, // Always update
  value: (contact) => ({ ...contact, name: 'Updated' }),
})
```

QueryClient knows whether the entity is an array or single item, so predicates work transparently on lists.

### Invalidate and refetch

```typescript
const queryClient = useQueryClient()

// Invalidate all queries with this key
queryClient.invalidate('contactList')

// Invalidate specific query
queryClient.invalidate(['contactDetail', { contactUuid: '123' }])

// After invalidation, the next query interaction triggers a refetch
```

Invalidation marks cached data as stale. The next interaction (component mount, user action) triggers a refetch.

## Common Mistakes

### HIGH: Call update/set without checking data structure (array vs entity)

```typescript
// ❌ Wrong: treating array like entity
const queryClient = useQueryClient()
queryClient.update('contactList', {
  by: (contact) => contact.id === '123',
  value: (contact) => ({ ...contact, name: 'Updated' }),
})
// If contactList is Contact[], predicate matches each item individually
// If you expect single match, this breaks silently
```

```typescript
// ✅ Correct: QueryClient infers type from query key
const queryClient = useQueryClient()
// If contactList: { entity: Contact[], ... }
// QueryClient knows to iterate the array and apply predicate to each item
queryClient.update('contactList', {
  by: (contact) => contact.id === '123',
  value: (contact) => ({ ...contact, name: 'Updated' }),
})
// For single entities: { entity: Contact, ... }
// QueryClient provides the entity directly to predicate
```

QueryClient infers data structure from your query key definition, so the same `update()` call works correctly for arrays and single entities. The type system ensures you're using the right predicate signature.

Source: `docs/packages/api-utils/pages/usage/query-client.md` Usage

### MEDIUM: Call set() without async loading state; UI flashes stale data

```typescript
// ❌ Wrong: immediate set without loading indicator
const queryClient = useQueryClient()
queryClient.set(['contactDetail', { contactUuid }], updatedData)
// Cache updated but no indicator that request is pending
// UI looks responsive but actually has unconfirmed data
```

```typescript
// ✅ Correct: pair optimistic update with mutation result handling
const queryClient = useQueryClient()
const original = queryClient.get(['contactDetail', { contactUuid }])

// Update cache optimistically
queryClient.set(['contactDetail', { contactUuid }], newData)

// Execute mutation
const result = await execute(formData)
if (result.isErr()) {
  // Rollback on error
  queryClient.set(['contactDetail', { contactUuid }], original)
}
```

If you update the cache without a mutation in flight, the UI looks responsive but the data is unconfirmed. Always pair cache updates with mutation execution and rollback on error.

Source: `docs/packages/api-utils/pages/usage/query-client.md` Real-World Example

## Cache Strategy

> Explicitly invalidate only the queries affected by the mutation. Let lazy refetch handle the rest when users navigate to pages needing other data.
>
> — Maintainer guidance

When a mutation succeeds, look at what changed:
- If you updated a contact, invalidate `contactDetail` and `contactList` (they both show that contact)
- If you archived a conversation, invalidate `conversationList` (but maybe not `conversationDetail` unless showing the one you archived)
- Don't invalidate unrelated queries — let them refetch lazily when needed

## Shared Cache Across Components

Important: Multiple components using the same query key share the same cached data. This is a feature, not a bug.

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

// resultA and resultB are the SAME cached value
// Mutation in B invalidates A's cache
```

Use this to your advantage: invalidate a query and all components using it refetch automatically.

## See Also

- [Writing Mutations](../writing-mutations/SKILL.md) — Every mutation needs to know which queries to invalidate
- [Writing Queries](../writing-queries/SKILL.md) — Understanding caching strategy informs cache management choices
