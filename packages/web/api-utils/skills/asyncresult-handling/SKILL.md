---
name: asyncresult-handling
description: Work with the three-state `AsyncResult<T, E>` (Loading / Ok / Err) that every api-utils query and mutation `result` returns — narrow with the `isLoading()` / `isOk()` / `isErr()` type predicates, read values via `getValue()` / `getError()`, handle every case with exhaustive `match()`, transform with `map()` / `mapErr()`, and fall back with `unwrapOr()`. Use this whenever rendering query/mutation state, safely extracting a value or error without `undefined`, or pattern-matching loading/ok/err in a component.
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
// - loading → AsyncResult.loading()
// - ok      → AsyncResult.ok(contact)
// - err     → AsyncResult.err(error)
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
  console.log('Error:', 'errors' in error ? error.errors[0].detail : error.message)
}
```

The type predicates `isLoading()`, `isOk()`, and `isErr()` narrow the type so `getValue()` and `getError()` are safe.

### Pattern match all three states

```typescript
const { result } = useQuery('contactDetail', { /* ... */ })

const label = result.value.match({
  loading: () => 'Loading…',
  ok: (contact) => `Name: ${contact.name}`,
  err: (error) => `Error: ${'errors' in error ? error.errors[0].detail : error.message}`,
})
```

`match()` is exhaustive — you must handle all three cases or TypeScript errors.

### Transform results with map and mapErr

```typescript
const { result } = useQuery('contactDetail', { /* ... */ })

// Transform the success value
const contactName = result.value.map(contact => contact.name)

// Transform the error
const errorMessage = result.value.mapErr(error => 'errors' in error ? error.errors[0].detail : error.message)

// Chain transformations
const displayText = result.value
  .map(contact => `Hello, ${contact.name}`)
  .mapErr(error => 'errors' in error ? error.errors[0].detail : error.message)
  .unwrapOr('No data')
```

`map()` and `mapErr()` return fresh `AsyncResult` values, letting you transform without unwrapping.

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

## Common Mistakes

### CRITICAL: Forget to check state before calling getValue/getError

```typescript
// ❌ Wrong: getValue without isOk check
const { result } = useQuery('contactDetail', { /* ... */ })
const contact = result.value.getValue()
console.log(contact.name) // contact could be null!
```

```typescript
// ✅ Correct: check isOk first
const { result } = useQuery('contactDetail', { /* ... */ })
if (result.value.isOk()) {
  const contact = result.value.getValue()
  console.log(contact.name) // Safe!
}
```

Calling `getValue()` without `isOk()` returns null if the result is loading or an error. You get no compile error, and the UI renders nothing or crashes at runtime.

Source: `src/async-result/asyncResult.ts`

### HIGH: Not handle all three states in match()

```typescript
// ❌ Wrong: missing loading handler
result.value.match({
  ok: (data) => data.name,
  err: (error) => ('errors' in error ? error.errors[0].detail : error.message),
  // Forgot loading! — TypeScript errors: match() requires all three handlers
})
```

```typescript
// ✅ Correct: handle all three states
result.value.match({
  loading: () => 'Loading…',
  ok: (data) => data.name,
  err: (error) => ('errors' in error ? error.errors[0].detail : error.message),
})
```

If you omit a handler, TypeScript errors and the UI renders nothing during the omitted state. The match is exhaustive by design.

Source: `src/async-result/asyncResult.ts` — `match()`

### HIGH: Use deprecated state flags (isLoading, isError, isSuccess) instead of AsyncResult state

```typescript
// ❌ Wrong: using deprecated flags
const { result, isLoading } = useQuery(...)
if (isLoading.value) {
  // Show spinner
} else {
  const data = result.value.getValue() // Could be null if isErr!
}
```

```typescript
// ✅ Correct: use AsyncResult state exclusively
const { result } = useQuery(...)
if (result.value.isLoading()) {
  // Show spinner
} else if (result.value.isOk()) {
  const data = result.value.getValue() // Safe!
}
```

`isLoading`, `isError`, and `isSuccess` on `UseQueryReturnType` are deprecated — they exist for backward compatibility but are less type-safe than AsyncResult. Always prefer `result.value.isLoading()`, `result.value.isErr()`, and `result.value.isOk()`.

Source: `src/composables/query/query.composable.ts` — `UseQueryReturnType` deprecated annotations

## Next Steps

- [Writing Queries](../writing-queries/SKILL.md) — Fetch single resources with caching
- [Handling Mutations](../writing-mutations/SKILL.md) — Create/update/delete with result handling

## Skill metadata

- **Library:** `@wisemen/vue-core-api-utils` (package `vue-core-api-utils`)
- **Type:** core
- **Authored against:** v1.2.0
- **Sources:**
  - `packages/web/api-utils/src/async-result/asyncResult.ts`
