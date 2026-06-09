---
name: foundations
description: Understand the architecture behind api-utils — how the three-state `AsyncResult` (neverthrow's `Result` plus a loading state) relates to `Result`, how `@tanstack/vue-query`'s lifecycle (`staleTime`, `gcTime`, refetch triggers) runs beneath it, and how TanStack Query + neverthrow + Vue 3 reactivity compose into the typed composables. Use this when you need the mental model behind queries and mutations, are reasoning about caching/staleness, or are working out how errors flow through `Result` vs `AsyncResult`.
---

# @wisemen/vue-core-api-utils — Foundations

Understand how api-utils' `AsyncResult`, `neverthrow`, and `@tanstack/vue-query` combine to provide structured error handling and reactive query management. This knowledge informs all other skills.

## Core Concepts

### AsyncResult: the three-state type system

`AsyncResult<T, E>` is api-utils' own type (defined in `src/async-result/asyncResult.ts`). It takes neverthrow's two-state `Result` and adds a third **loading** state, so a query is always in exactly one of three states:

```typescript
type AsyncResult<T, E> =
  | AsyncResultLoading<T, E>
  | AsyncResultOk<T, E>
  | AsyncResultErr<T, E>
```

It replaces the traditional bag of separate flags:

```typescript
// ❌ Old pattern: multiple flags
const isLoading = ref(false)
const isError = ref(false)
const data = ref(null)
const error = ref(null)

// Which combinations are valid? isLoading + isError? isLoading + data?
// The state machine is implicit and error-prone.
```

```typescript
// ✅ AsyncResult: a single discriminated union
import { AsyncResult } from '@wisemen/vue-core-api-utils'

// Construct with the factory — the class constructors are private:
const result = ref<AsyncResult<Contact, ApiError>>(AsyncResult.loading())
// AsyncResult.loading() | AsyncResult.ok(value) | AsyncResult.err(error)

// Only three valid states; the type system enforces exhaustive handling.
const label = result.value.match({
  loading: () => 'Loading…',
  ok: (contact) => contact.name,
  err: (error) => ('errors' in error ? error.errors[0].detail : error.message),
})
```

### Three-state representation

| State | When | Read with | Next |
|-------|------|-----------|------|
| **Loading** | Initial state while the query is in flight | Show spinner/skeleton | → Ok or Err |
| **Ok(T)** | Server returned success | `isOk()` then `getValue()` | Stays Ok until refetch |
| **Err(E)** | Server or network error | `isErr()` then `getError()` | Query can be retried |

```typescript
import { computed } from 'vue'
import { useQuery } from '@/api'

const { result } = useQuery('contactDetail', {
  params: { contactUuid: computed(() => uuid) },
  queryFn: () => ContactService.getDetail(uuid),
})

// result is a ComputedRef<AsyncResult<Contact, ApiError>>
const label = result.value.match({
  loading: () => 'Loading…',
  ok: (contact) => contact.name,
  err: (error) => ('errors' in error ? error.errors[0].detail : error.message),
})
```

### neverthrow `Result` vs `AsyncResult`

`neverthrow` provides `Result<T, E>` for synchronous success/failure. api-utils builds on it, and the two have **different APIs** — this is the single most common source of mistakes:

- A **service / `queryFn` / `execute()`** returns a neverthrow `Result` (api-utils aliases it as `ApiResult<T>`). Handle it with `isOk()` / `isErr()` and the **`.value`** / **`.error`** properties, or neverthrow's two-argument `match(okFn, errFn)`.
- A composable's reactive **`result`** is an `AsyncResult`. Handle it with `isLoading()` / `isOk()` / `isErr()` and the **`getValue()`** / **`getError()`** methods, or the object-form `match({ loading, ok, err })`.

```typescript
// neverthrow Result (what a queryFn / execute() resolves to): two-arg match, .value / .error
const result: ApiResult<Contact> = await ContactService.getDetail(uuid)

result.match(
  (contact) => console.log(contact.name),
  (error) => console.error('errors' in error ? error.errors[0].detail : error.message),
)
```

```typescript
// AsyncResult (a composable's reactive result): object-form match with a loading case
const state: AsyncResult<Contact, ApiError> = AsyncResult.loading()

state.match({
  loading: () => console.log('Waiting…'),
  ok: (contact) => console.log(contact.name),
  err: (error) => console.error('errors' in error ? error.errors[0].detail : error.message),
})
```

`AsyncResult` is `Result` plus a loading state. Every composable that fetches data exposes an `AsyncResult`.

### Type guards

`isOk()` / `isErr()` / `isLoading()` are type predicates that narrow the union, making `getValue()` / `getError()` safe:

```typescript
const result = AsyncResult.ok<Contact, ApiError>(contact)
if (result.isOk()) {
  const contact = result.getValue() // narrowed to AsyncResultOk → getValue() is available
}

const errResult = AsyncResult.err<Contact, ApiError>(error)
if (errResult.isErr()) {
  const error = errResult.getError() // narrowed to AsyncResultErr → getError() is available
}
```

> `getValue()` exists only on `AsyncResultOk` and `getError()` only on `AsyncResultErr`. Call them **after** the matching `isOk()` / `isErr()` guard, or use `match()`.

## TanStack Query lifecycle

`@tanstack/vue-query` manages the async lifecycle beneath `AsyncResult`.

### Query state machine

```
[Initial]
   ↓ fetch
[Fetching]   (isLoading on first load)
   ↓ success
[Fresh]  →  [Stale after staleTime]   (cached; refetched on the next trigger)
   ↓ no observers
[Inactive]  →  evicted after gcTime
```

### staleTime: how long cached data stays fresh

```typescript
const { result } = useQuery('contactDetail', {
  params: { contactUuid: computed(() => uuid) },
  queryFn: () => ContactService.getDetail(uuid),
  staleTime: 5 * 60 * 1000, // 5 minutes
})

// T=0:     First fetch resolves to Ok(contact); the freshness window starts.
// T=4m59s: Still fresh — cached contact returned instantly, no refetch.
// T=5m01s: Now stale — cached contact still shown, but the next trigger refetches.
```

`staleTime` is the **grace period** before cached data is considered outdated. While fresh, reads return the cache instantly without refetching. The default is `0` (immediately stale). It is the one TanStack timing option api-utils' `useQuery` exposes per call.

### gcTime: when unused cache is evicted

`gcTime` controls cache **eviction**; `staleTime` controls **freshness**. After a query has no observers (its component unmounts), its data is kept for `gcTime` and then garbage-collected. api-utils' `useQuery` does not take `gcTime` per call — set it as a TanStack default in your plugin config:

```typescript
app.use(apiUtilsPlugin({
  defaultOptions: {
    queries: {
      staleTime: 5 * 60 * 1000, // fresh for 5 minutes
      gcTime: 60 * 60 * 1000,   // retain unused cache for 1 hour
    },
  },
}))
```

Navigate back within `gcTime` → cached (possibly stale) data. After `gcTime` → the next access refetches from scratch.

### Refetch triggers

A query refetches when:

1. **Manual** — you call `refetch()`
2. **Invalidation** — a mutation lists the key in `queryKeysToInvalidate`
3. **Stale access** — the next interaction after `staleTime` elapses
4. **Window focus** — on refocus (configurable)
5. **Remount** — a new observer mounts while data is stale or evicted

```typescript
const { result, refetch } = useQuery('contactDetail', {
  params: { contactUuid: computed(() => uuid) },
  queryFn: () => ContactService.getDetail(uuid),
  staleTime: 5 * 60 * 1000,
})

await refetch() // manual

// Automatic invalidation from a mutation:
const { execute } = useMutation({
  queryFn: (options: { body: ContactUpdateForm }) => ContactService.update(options.body),
  queryKeysToInvalidate: {
    contactDetail: {}, // {} invalidates every contactDetail query; add param extractors to target one
  },
})
// After execute() succeeds, contactDetail refetches.
```

## Composable architecture

Each composable in api-utils is built from three layers:

1. **TanStack Query composable** — `useQuery` / `useInfiniteQuery` / `useMutation` from `@tanstack/vue-query`
2. **AsyncResult wrapper** — a neverthrow `Result` lifted into the three-state `AsyncResult`
3. **Typed surface** — your `RegisteredQueryKeys` and error codes via module augmentation

```typescript
// What you use:
const { result, refetch } = useQuery('contactDetail', {
  params: { contactUuid: computed(() => uuid) },
  queryFn: () => ContactService.getDetail(uuid),
  staleTime: 5 * 60 * 1000,
})

// Illustrative pseudocode — the composable lifts TanStack's state into one AsyncResult:
const result = computed(() => {
  if (query.isLoading.value) return AsyncResult.loading()
  if (query.data.value?.isErr()) return AsyncResult.err(query.data.value.getError())
  return AsyncResult.ok(query.data.value!.getValue())
})
```

You just consume `result.value.match()` or the type guards.

## Error handling strategy

Errors are typed and structured. `ApiError` is the error half of every `ApiResult` / `AsyncResult`:

```typescript
// From src/types/apiError.type.ts
interface ApiKnownErrorObject<TCode extends string = string> {
  code: TCode
  detail: string
  status: string
  source?: { pointer: string }
}

interface ApiExpectedError<TCode extends string = string> {
  errors: ApiErrorObject<TCode>[]
}

// A structured API error OR a native/unexpected Error:
type ApiError<TCode extends string = string> = ApiExpectedError<TCode> | Error
```

`ApiExpectedError` is a **type**, not a class, so narrow with the `'errors' in error` check (never `instanceof`):

```typescript
result.value.match({
  loading: () => {},
  ok: (data) => { /* … */ },
  err: (error) => {
    if ('errors' in error) {
      // Structured API error
      const codes = error.errors.map((e) => e.code)
      console.error(error.errors[0].detail)
    } else {
      // Native / network Error
      console.error(error.message)
    }
  },
})
```

The error-code type comes from the generic `TErrorCode` you register, so `error.errors[0].code` is typed across queries and mutations.

## Common Mistakes

### CRITICAL: Confuse `Result` (neverthrow) with `AsyncResult`

```typescript
// ❌ Wrong: treating AsyncResult like a boolean, or using the wrong match form
const { result } = useQuery(/* … */)
if (result.value) {
  // Always truthy — result.value is always a Loading | Ok | Err object
}
result.value.match(okFn, errFn) // AsyncResult needs the object form, not two args
```

```typescript
// ✅ Correct: AsyncResult → object-form match / getValue()/getError()
const { result } = useQuery('contactDetail', {
  params: { contactUuid: computed(() => uuid) },
  queryFn: () => ContactService.getDetail(uuid),
})

result.value.match({
  loading: () => showSpinner(),
  ok: (contact) => showContact(contact),
  err: (error) => showError(error),
})

// or, with guards:
if (result.value.isOk()) {
  console.log(result.value.getValue())
} else if (result.value.isErr()) {
  console.log(result.value.getError())
}
```

`queryFn` / `execute()` return a neverthrow `Result` (`.value` / `.error`); a composable's `result` is an `AsyncResult` (`getValue()` / `getError()`). Don't mix the two APIs.

Source: `src/async-result/asyncResult.ts`, `src/types/apiError.type.ts`

### MEDIUM: Assume `staleTime` auto-refetches

```typescript
// ❌ Wrong: expecting a refresh exactly at staleTime
useQuery('contactDetail', { /* … */, staleTime: 5 * 60 * 1000 })
// At T=5m nothing happens automatically; the data is just marked stale.
```

```typescript
// ✅ Correct: staleTime is a freshness window, not a timer.
// Refetch happens on the next trigger (access, focus, invalidation, remount).
// For polling, drive refetch() yourself:
import { onScopeDispose } from 'vue'

const { refetch } = useQuery('contactDetail', { /* … */, staleTime: 5 * 60 * 1000 })
const id = setInterval(refetch, 10_000)
onScopeDispose(() => clearInterval(id))
```

`staleTime` marks data stale; it does not schedule a refetch.

Source: `src/config/config.ts`

### HIGH: Assume the cache persists forever (gcTime)

If a query has no observers for longer than `gcTime`, it is evicted and the next access refetches. Raise `gcTime` (in the plugin defaults — not per call) when you want longer-lived cache:

```typescript
app.use(apiUtilsPlugin({
  defaultOptions: {
    queries: {
      staleTime: 5 * 60 * 1000, // reads stay fresh for 5 min
      gcTime: 60 * 60 * 1000,   // unused cache retained for 1 hour
    },
  },
}))
```

Longer `gcTime` keeps cache around longer; longer `staleTime` lets more reads skip refetching.

Source: `src/config/config.ts`

### MEDIUM: Forget the QueryClient is shared app-wide

```typescript
// One invalidation affects every component using that key — by design.
const { execute } = useMutation({
  queryFn: (options: { body: ContactUpdateForm }) => ContactService.update(options.body),
  queryKeysToInvalidate: {
    contactDetail: {}, // every component reading contactDetail refetches
    contactList: {},   // lists that include this contact refetch too
  },
})
```

The QueryClient is an application-wide singleton: invalidating a key refetches it everywhere it is used. That shared cache is the intended design.

Source: `src/utils/query-client/queryClient.ts`

## Integration pattern

```
User interaction
    ↓
useQuery / useMutation composable     (typed via RegisteredQueryKeys)
    ↓
@tanstack/vue-query                   (fetch, cache, lifecycle)
    ↓
queryFn → neverthrow Result           (.value / .error)
    ↓
AsyncResult  (Loading | Ok | Err)     (getValue() / getError() / match())
    ↓
Vue computed ref                      (reactive)
    ↓
Template: result.value.match({ … })
```

Each layer adds value: composables add type safety, TanStack Query handles caching and lifecycle, neverthrow enforces error handling, `AsyncResult` makes state explicit, and Vue reactivity keeps the UI in sync.

## See Also

- [AsyncResult Handling](../asyncresult-handling/SKILL.md) — Pattern matching and type guards in depth
- [Writing Queries](../writing-queries/SKILL.md) — Applying staleTime and refetch in real queries
- [Writing Mutations](../writing-mutations/SKILL.md) — How mutations invalidate the cache
- [Cache Management](../cache-management/SKILL.md) — Manual cache operations

## Skill metadata

- **Library:** `@wisemen/vue-core-api-utils` (package `vue-core-api-utils`)
- **Type:** core
- **Authored against:** v1.2.0
- **Sources:**
  - `packages/web/api-utils/src/async-result/asyncResult.ts`
  - `packages/web/api-utils/src/types/apiError.type.ts`
  - `packages/web/api-utils/src/config/config.ts`
