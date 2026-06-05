---
name: asyncresult-handling
description: >
  Three-state AsyncResult type (Loading, Ok, Err), isLoading/isOk/isErr type predicates, getValue/getError accessors, match() pattern matching, map/mapErr transformations, safe value extraction without undefined.
type: core
library: vue-core-api-utils
---

# @wisemen/vue-core-api-utils — Handling AsyncResult Types

All queries and mutations return `AsyncResult<T, E>` — a type-safe alternative to separate `data`, `error`, and `isLoading` states. AsyncResult is always in one of three states: Loading, Ok, or Err.

## Setup

```typescript
import { useQuery } from '@/api'

const { result } = useQuery('contactDetail', {
  params: { contactUuid: computed(() => '123') },
  queryFn: () => ContactService.getByUuid('123'),
})

// result is a ComputedRef<AsyncResult<Contact, ApiError>>
// It's always in one of three states:
// - AsyncResult.Loading()
// - AsyncResult.Ok(contact: Contact)
// - AsyncResult.Err(error: ApiError)
```

## Core Patterns

### Check state and extract values safely

```typescript
const { result } = useQuery('contactDetail', { /* ... */ })

if (result.value.isLoading()) {
  console.log('Request in flight...')
} else if (result.value.isOk()) {
  const contact = result.value.getValue()
  console.log('Name:', contact.name) // TypeScript knows contact is Contact
} else if (result.value.isErr()) {
  const error = result.value.getError()
  console.log('Error:', error.detail)
}
```

The type predicates `isLoading()`, `isOk()`, and `isErr()` narrow the type so `getValue()` and `getError()` are safe.

### Pattern match all three states

```typescript
const { result } = useQuery('contactDetail', { /* ... */ })

result.value.match({
  loading: () => <div>Loading...</div>,
  ok: (contact) => <div>Name: {contact.name}</div>,
  err: (error) => <div>Error: {error.detail}</div>,
})
```

`match()` is exhaustive — you must handle all three cases or TypeScript errors.

### Transform results with map and mapErr

```typescript
const { result } = useQuery('contactDetail', { /* ... */ })

// Transform the success value
const contactName = result.value.map(contact => contact.name)

// Transform the error
const errorMessage = result.value.mapErr(error => error.detail)

// Chain transformations
const displayText = result.value
  .map(contact => `Hello, ${contact.name}`)
  .mapErr(error => `Failed: ${error.detail}`)
  .unwrapOr('No data')
```

`map()` and `mapErr()` return new AsyncResult values, letting you transform without unwrapping.

### Use unwrapOr for fallback values

```typescript
const { result } = useQuery('contactDetail', { /* ... */ })

// Get the value if Ok, otherwise use fallback
const contact = result.value.unwrapOr(null)
// Type: Contact | null

const name = result.value
  .map(c => c.name)
  .unwrapOr('Unknown')
// Type: string
```

## Next Steps

- [Writing Queries](../writing-queries/SKILL.md) — Fetch single resources with caching
- [Handling Mutations](../writing-mutations/SKILL.md) — Create/update/delete with result handling
