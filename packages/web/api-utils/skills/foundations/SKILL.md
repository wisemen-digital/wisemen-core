---
name: foundations
description: >
  neverthrow Result architectural basis; three-state AsyncResult relationship to Result; @tanstack/vue-query lifecycle (staleTime, gcTime, refetch); composition of TanStack Query + neverthrow + Vue 3 reactivity.
type: core
library: vue-core-api-utils
library_version: "0.0.3"
sources:
  - "wisemen-digital/wisemen-core:docs/packages/api-utils/pages/concepts/result-types.md"
  - "wisemen-digital/wisemen-core:packages/web/api-utils/src/async-result/asyncResult.ts"
  - "wisemen-digital/wisemen-core:packages/web/api-utils/src/types/apiError.type.ts"
  - "wisemen-digital/wisemen-core:packages/web/api-utils/src/config/config.ts"
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

## Common Mistakes

### CRITICAL: Confuse Result (neverthrow) with AsyncResult; treat ok/err as boolean

```typescript
// ❌ Wrong: neverthrow Result is not AsyncResult
const result = new Result(contact, null) // This is not how neverthrow works
if (result.ok) { // `.ok` doesn't exist
  console.log(result.value)
}

// Or even worse: treating AsyncResult like a boolean
const { result } = useQuery(...)
if (result.value) {
  // This is always true; result is always defined (Loading | Ok | Err)
}
```

```typescript
// ✅ Correct: AsyncResult requires exhaustive pattern matching
const { result } = useQuery('contactDetail', {
  queryFn: () => ContactService.getDetail(uuid),
})

result.value.match({
  loading: () => showSpinner(),
  ok: (contact) => showContact(contact),
  err: (error) => showError(error),
})

// Or use type guards
if (result.value.isOk()) {
  console.log(result.value.getValue())
} else if (result.value.isErr()) {
  console.log(result.value.getError())
} else {
  showSpinner()
}
```

AsyncResult requires explicit handling of all three states. The type system won't let you skip a state.

Source: `docs/packages/api-utils/pages/concepts/result-types.md`

### MEDIUM: Misunderstand staleTime; think data refreshes automatically after staleTime

```typescript
// ❌ Wrong: assuming staleTime auto-refetches
const { result } = useQuery('contactDetail', {
  queryFn: () => ContactService.getDetail(uuid),
  staleTime: 5 * 60 * 1000, // Not an auto-refresh interval
})

// At T=5m, data doesn't automatically refetch.
// It's just marked stale. Refetch happens on next interaction
// (component mount, user action, mutation invalidation)
```

```typescript
// ✅ Correct: staleTime is a grace period, not an interval
const { result, refetch } = useQuery('contactDetail', {
  queryFn: () => ContactService.getDetail(uuid),
  staleTime: 5 * 60 * 1000,
})

// Data is fresh for 5 minutes (instant returns)
// After 5 minutes, next access triggers refetch
// For auto-refresh, use refetch() in a watchEffect or timer

watchEffect(async () => {
  // Refetch every 10 seconds
  const interval = setInterval(() => refetch(), 10 * 1000)
  onCleanup(() => clearInterval(interval))
})
```

Stale time is not an auto-refresh interval. It's the duration the cache is considered fresh without refetching. Refetch happens on next access or when explicitly triggered.

### HIGH: Misunderstand gcTime and cache eviction; assume cache persists forever

```typescript
// ❌ Wrong: assuming cache is permanent
const { result } = useQuery('contactDetail', {
  queryFn: () => ContactService.getDetail(uuid),
  gcTime: 5 * 60 * 1000, // Default is 5 minutes
})

// If component unmounts and user is gone for > 5 minutes,
// Next access refetches fresh (cache is evicted)
// This is correct behavior, but if you expected cached data...
```

```typescript
// ✅ Correct: increase gcTime if you want longer-lived cache
const { result } = useQuery('contactDetail', {
  queryFn: () => ContactService.getDetail(uuid),
  staleTime: 5 * 60 * 1000,    // Fresh for 5 minutes
  gcTime: 60 * 60 * 1000,       // Keep in memory for 1 hour
})

// After 5 minutes (stale) but before 1 hour (gc),
// Returning cached data (but trigger refetch automatically)
// After 1 hour, cache is deleted; next access refetches fresh
```

gcTime controls cache eviction. Longer gcTime = cache lives longer. Longer staleTime = more queries use cache without refetching. Both are configurable defaults in the plugin config.

Source: `packages/web/api-utils/src/config/config.ts`

### MEDIUM: Forget that QueryClient is shared; one query invalidation affects all components

```typescript
// ❌ Wrong: not realizing cache is global
const { execute } = useMutation({
  queryFn: () => ContactService.update(data),
  queryKeysToInvalidate: { contactDetail: () => true },
})

// Component A: detail view
// Component B: list view (also uses contactDetail)
// Even though A only updated one contact,
// B's cache is invalidated too (because same query key)
```

```typescript
// ✅ Correct: QueryClient is intentionally shared
export function useContactMutation() {
  const { execute } = useMutation({
    queryFn: () => ContactService.update(data),
    queryKeysToInvalidate: { 
      // Invalidates all components using this key
      contactDetail: () => true,
      // Also invalidate lists that show this contact
      contactList: () => true,
    },
  })
  
  return { execute }
}

// When A updates a contact, both A and B refetch.
// This is the intended design: shared cache across app.
```

QueryClient is application-wide (singleton). Invalidating a query invalidates for all components using that key. This is a feature: synchronized cache across the app.

Source: `packages/web/api-utils/src/utils/query-client/queryClient.ts`

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
