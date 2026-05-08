---
name: foundations
description: >
  neverthrow Result architectural basis; three-state AsyncResult relationship to Result; @tanstack/vue-query lifecycle (staleTime, gcTime, refetch); composition of TanStack Query + neverthrow + Vue 3 reactivity.
type: core
library: vue-core-api-utils
---

# @wisemen/vue-core-api-utils — Foundations

Understand how `AsyncResult` from `neverthrow` and `@tanstack/vue-query` combine to provide structured error handling and reactive query management. This knowledge informs all other skills.

## Core Concepts

### AsyncResult: The three-state type system

`AsyncResult<T, E>` is a Result type from the `neverthrow` library that explicitly models three states:

```typescript
type AsyncResult<T, E> = AsyncResultLoading 
  | AsyncResultOk<T>
  | AsyncResultErr<E>
```

The three states replace traditional Vue composition with separate flags:

```typescript
// ❌ Old pattern: multiple flags
const isLoading = ref(false)
const isError = ref(false)
const data = ref(null)
const error = ref(null)

// Which combinations are valid? isLoading + isError? isLoading + data?
// The state machine is implicit, error-prone
```

```typescript
// ✅ AsyncResult: single discriminated union
const result = ref<AsyncResult<Contact, ApiError>>(new AsyncResultLoading())

// Only three valid states; type system enforces them
// Pattern matching makes every state explicit
result.value.match({
  loading: () => 'Loading...',
  ok: (contact) => contact.name,
  err: (error) => error.message,
})
```

### Three-state representation

AsyncResult wraps any promise-based operation:

| State | Setup | Usage | Next |
|-------|-------|-------|------|
| **Loading** | Initial state when query starts | Show spinner/skeleton | → Ok or Err |
| **Ok(T)** | Server returned success with data | Show data with `getValue()` | Stays Ok until refetch |
| **Err(E)** | Server returned error or network failed | Show error with `getError()` | Query can be retried |

```typescript
import { useQuery } from '@/api'

const { result } = useQuery('contactDetail', {
  queryFn: () => ContactService.getDetail(uuid),
})

// result is computed ref to AsyncResult<Contact, ApiError>
result.value.match({
  loading: () => <div>Loading</div>,
  ok: (contact) => <div>{contact.name}</div>,
  err: (error) => <div>Error: {error.message}</div>,
})
```

### neverthrow Result vs AsyncResult

neverthrow provides `Result<T, E>` for synchronous operations. `AsyncResult` extends it for async:

```typescript
// neverthrow Result: already resolved
const result: Result<Contact, ApiError> = await contactService.getDetail()

result.match({
  ok: (contact) => console.log(contact.name),
  err: (error) => console.error(error.message),
})
```

```typescript
// AsyncResult: waiting for promise
const result: AsyncResult<Contact, ApiError> = new AsyncResultLoading()

result.match({
  loading: () => console.log('Waiting...'),
  ok: (contact) => console.log(contact.name),
  err: (error) => console.error(error.message),
})
```

AsyncResult is Result + loading state. Every composable that fetches data returns AsyncResult.

### Type guards from neverthrow

Safely extract values using type guards:

```typescript
const result = new AsyncResultOk(contact)

// Type predicate
if (result.isOk()) {
  const contact = result.getValue() // No type error; TypeScript knows it's Contact
}

const errResult = new AsyncResultErr(error)
if (errResult.isErr()) {
  const error = errResult.getError() // No type error; TypeScript knows it's ApiError
}

if (!result.isLoading()) {
  // Could be Ok or Err
}
```

## TanStack Query Lifecycle

`@tanstack/vue-query` manages the async lifecycle beneath AsyncResult.

### Query state machine

```
[Initial]
   ↓
[Fetching] (isLoading)
   ↓
[Stale] (cached data exists but flagged for refresh)
   ↓
[Inactive] (unused queries auto-cleanup after gcTime)
```

### Stale time: How long is cached data fresh?

```typescript
const { result } = useQuery('contactDetail', {
  queryFn: () => ContactService.getDetail(uuid),
  staleTime: 5 * 60 * 1000, // 5 minutes
})

// Timeline:
// T=0:    First fetch. Result is Ok(contact). freshInterval starts.
// T=4m59s: Data is still fresh. Returning cached contact instantly.
// T=5m01s: Data is now stale. Still showing cached contact, but next interaction refetches.
// T=next-page-view: Fresh fetch triggered automatically.
```

Stale time is the **grace period** before the cache is considered outdated. While fresh, subsequent requests return cache instantly without refetching.

### Garbage collection time: When does cache disappear?

```typescript
const gcTime = 5 * 60 * 1000 // 5 minutes

// Query runs, then becomes unused (component unmounts, user navigates away).
// For gcTime duration, data is kept in memory (but marked as stale).
// After gcTime, if query hasn't been accessed, it's deleted from cache.
```

gcTime is cleanup. If you navigate back before gcTime expires, you get the cached (stale) data. After gcTime, next access refetches fresh.

### Refetch triggers

Queries refetch when:

1. **Manual trigger** — `refetch()` function
2. **Mutation invalidation** — `queryKeysToInvalidate` in mutation definition
3. **Stale time expired** — Next component interaction after staleTime passes
4. **Focus refetch** — Window regains focus (configurable)
5. **Component mount** — If cache is beyond gcTime

```typescript
const { result, refetch } = useQuery('contactDetail', {
  queryFn: () => ContactService.getDetail(uuid),
  staleTime: 5 * 60 * 1000,
})

// Manual refetch
async function handleRefresh() {
  await refetch()
  // result updates to new Ok or Err
}

// Automatic refetch on mutation (via queryKeysToInvalidate)
const { execute } = useMutation({
  queryFn: (data) => ContactService.update(data),
  queryKeysToInvalidate: { contactDetail: () => true },
})
// After execute succeeds, contactDetail is invalidated
// Next useQuery('contactDetail') refetches fresh data
```

## Composable architecture

Each composable in vue-core-api-utils is built from:

1. **TanStack Query composable** — `useQuery`, `useInfiniteQuery`, `useMutation` from @tanstack/vue-query
2. **AsyncResult wrapper** — Result from neverthrow with loading state
3. **Type-safe parameters** — ProjectQueryKeys and error codes from your domain

```typescript
// High-level (what you use)
const { result, isLoading, refetch } = useQuery('contactDetail', {
  params: computed(() => ({ uuid })),
  queryFn: () => ContactService.getDetail(uuid),
  staleTime: 5 * 60 * 1000,
})

// Under the hood:
// 1. TanStack Query manages the fetch lifecycle
const query = useQueryRaw(queryKey, queryFn, { staleTime })

// 2. Wrap query state in AsyncResult
const result = computed(() => {
  if (query.isLoading.value) return new AsyncResultLoading()
  if (query.isError.value) return new AsyncResultErr(query.error.value)
  return new AsyncResultOk(query.data.value)
})

// 3. Expose typed composable
return { result, isLoading: query.isLoading, refetch: query.refetch }
```

The composables handle this composition. You just use `result.value.match()`.

## Error handling strategy

Errors are typed and structured using `neverthrow`:

```typescript
// Error type definition
interface ApiExpectedError {
  errors: Array<{
    code: string
    message: string
    details?: unknown
  }>
}

type ApiError = ApiExpectedError | ApiUnexpectedError

// In AsyncResult
const result = new AsyncResultErr(apiError)

result.match({
  ok: (data) => {}, // not executed
  err: (error) => {
    // error is ApiError
    if (error instanceof ApiExpectedError) {
      // Handle known API errors
      const codes = error.errors.map(e => e.code)
    } else {
      // Handle network/parsing errors
      console.error(error.message)
    }
  },
})
```

Error types are defined at library initialization via the generic `TErrorCode`. This ensures type-safe error handling across queries and mutations.

## Integration pattern

The full integration:

```
User interaction
    ↓
useQuery/useMutation composable
    ↓
@tanstack/vue-query (fetch + cache mgmt)
    ↓
Promise from queryFn
    ↓
neverthrow Result handling
    ↓
AsyncResult (Loading | Ok | Err)
    ↓
Vue computed ref (reactive)
    ↓
Template pattern matching with result.value.match()
```

Each layer adds value:
- **User interaction** triggers the flow
- **Composable** provides type safety (ProjectQueryKeys)
- **TanStack Query** handles caching, refetching, lifecycle
- **neverthrow** enforces error handling at compile time
- **AsyncResult** makes state explicit in templates
- **Vue reactivity** keeps UI synchronized

Understanding this stack helps you use each piece correctly.

## See Also

- [AsyncResult Handling](../asyncresult-handling/SKILL.md) — Deep dive into pattern matching and type guards
- [Writing Queries](../writing-queries/SKILL.md) — Applying staleTime and refetch in real queries
- [Writing Mutations](../writing-mutations/SKILL.md) — How mutations invalidate cache
- [Cache Management](../cache-management/SKILL.md) — Manual cache operations behind the scenes
