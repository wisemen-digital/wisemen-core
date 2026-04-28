# @wisemen/vue-core-api-utils — Skill Spec

A Vue 3 wrapper library built on TanStack Query that provides type-safe composables for API data fetching with structured error handling via AsyncResult. All queries and mutations return exhaustive three-state results (Loading | Ok | Err) instead of separate data/error/loading states.

## Domains

| Domain | Description | Skills |
| ------ | ----------- | ------ |
| Type-Safe Result Handling | Understanding the three-state AsyncResult type and exhaustive pattern matching | getting-started, asyncresult-handling |
| Data Fetching & Caching | Querying single and paginated data with automatic caching and staleness strategies | writing-queries, writing-infinitequeries |
| State Mutations & Cache Sync | Creating, updating, deleting data via mutations and keeping cache in sync | writing-mutations, cache-management |
| Performance Optimization | Prefetching, optimistic updates, and responsive UIs without unnecessary refetches | optimistic-uis |
| Library Foundations | How AsyncResult (neverthrow) and @tanstack/vue-query underpin the library | foundations |

## Skill Inventory

| Skill | Type | Domain | Covers | Failure Modes |
| ----- | ---- | ------ | ------ | ------------- |
| Getting Started | lifecycle | Type-Safe Result Handling | initializeApiUtils, QueryKeys interface, plugin setup, API factory | 2 |
| Handling AsyncResult Types | core | Type-Safe Result Handling | Three states, predicates, pattern matching, transformations | 3 |
| Writing Queries | core | Data Fetching & Caching | useQuery, params, staleTime, refetch, loading vs fetching | 4 |
| Writing Infinite Queries | core | Data Fetching & Caching | Offset/keyset pagination, fetchNextPage, hasNextPage, result structure | 4 |
| Writing Mutations | core | State Mutations & Cache Sync | useMutation, execute, queryKeysToInvalidate, error handling | 4 |
| Cache Management | core | State Mutations & Cache Sync | useQueryClient, get/set/update/invalidate, predicates | 2 |
| Building Optimistic UIs | composition | Performance Optimization | Optimistic updates + rollback, combining queries/mutations/cache, error codes | 3 |
| Understanding Foundations | core | Library Foundations | neverthrow Results, @tanstack/vue-query caching, Vue reactivity | 2 |

## Failure Mode Inventory

### Getting Started (2 failure modes)

| # | Mistake | Priority | Source | Cross-skill? |
| --- | ------- | -------- | ------ | ------------ |
| 1 | Forget to initialize apiUtilsPlugin before creating composables | CRITICAL | source code assertion | — |
| 2 | Define query keys interface without strict entity/params structure | HIGH | docs installation.md | asyncresult-handling |

### Handling AsyncResult Types (3 failure modes)

| # | Mistake | Priority | Source | Cross-skill? |
| --- | ------- | -------- | ------ | ------------ |
| 1 | Forget to check state before calling getValue/getError | CRITICAL | docs result-types.md | writing-queries, writing-mutations |
| 2 | Not handle all three states in match() | HIGH | docs result-types.md | writing-queries |
| 3 | Use state flags (isLoading, isError) inconsistently with AsyncResult | HIGH | maintainer interview | writing-queries |

### Writing Queries (4 failure modes)

| # | Mistake | Priority | Source | Cross-skill? |
| --- | ------- | -------- | ------ | ------------ |
| 1 | Import useQuery from @tanstack/vue-query instead of api-utils factory | CRITICAL | library architecture | asyncresult-handling, cache-management |
| 2 | Use plain ref for params instead of computed | HIGH | docs query.md | asyncresult-handling |
| 3 | Not set staleTime; serve stale cache indefinitely | HIGH | docs installation.md | cache-management, foundations |
| 4 | Confuse isFetching with isLoading | MEDIUM | docs query.md | asyncresult-handling |

### Writing Infinite Queries (4 failure modes)

| # | Mistake | Priority | Source | Cross-skill? |
| --- | ------- | -------- | ------ | ------------ |
| 1 | Import useInfiniteQuery from @tanstack/vue-query instead of factory | CRITICAL | library architecture | asyncresult-handling, cache-management |
| 2 | Return paginated data without wrapping in data/meta structure | CRITICAL | docs paginated-query.md | writing-mutations |
| 3 | Mix offset and keyset pagination patterns in same query | HIGH | docs paginated-query.md | — |
| 4 | Forget isFetchingNextPage flag; show loading on first page load | MEDIUM | docs paginated-query.md | asyncresult-handling |

### Writing Mutations (4 failure modes)

| # | Mistake | Priority | Source | Cross-skill? |
| --- | ------- | -------- | ------ | ------------ |
| 1 | Import useMutation from @tanstack/vue-query instead of factory | CRITICAL | library architecture | asyncresult-handling, cache-management |
| 2 | Forget to list queryKeysToInvalidate; cache becomes stale | CRITICAL | docs mutation.md | cache-management, optimistic-uis |
| 3 | Not await execute(); code runs before mutation completes | HIGH | docs mutation.md | asyncresult-handling |
| 4 | Use body instead of params for query parameters | HIGH | source code | — |

### Cache Management (2 failure modes)

| # | Mistake | Priority | Source | Cross-skill? |
| --- | ------- | -------- | ------ | ------------ |
| 1 | Call update/set without checking data structure (array vs entity) | HIGH | docs query-client.md | writing-infinitequeries |
| 2 | Call set() without async loading state; UI flashes stale data | MEDIUM | docs query-client.md | optimistic-uis |

### Building Optimistic UIs (3 failure modes)

| # | Mistake | Priority | Source | Cross-skill? |
| --- | ------- | -------- | ------ | ------------ |
| 1 | Optimistic update without rollback; errors leave wrong data | CRITICAL | docs query-client.md | asyncresult-handling, writing-mutations |
| 2 | Optimistic update but old query still refetches in background | HIGH | TanStack Query best practices | cache-management, writing-mutations |
| 3 | Skip defining explicit error codes; generic "error" message in UI | MEDIUM | maintainer interview | asyncresult-handling |

### Understanding Foundations (2 failure modes)

| # | Mistake | Priority | Source | Cross-skill? |
| --- | ------- | -------- | ------ | ------------ |
| 1 | Treat AsyncResult like a Promise; try/catch mutations | HIGH | docs result-types.md | asyncresult-handling, writing-mutations |
| 2 | Assume each component gets its own query cache | HIGH | TanStack Query docs | cache-management, writing-queries |

## Tensions

| Tension | Skills | Agent Implication |
| ------- | ------ | ------------------- |
| Getting Started simplicity vs. Production robustness | writing-queries, cache-management | Initial queries skip staleTime and invalidation, causing stale data bugs |
| Optimistic updates vs. Data consistency | optimistic-uis, cache-management | Agents implement optimistic updates without rollback, leaving corrupt state |
| Type safety vs. Setup verbosity | getting-started, asyncresult-handling | Agents skip error codes or query keys to reduce typing |
| AsyncResult exhaustiveness vs. backwards-compatible flags | asyncresult-handling, writing-queries | Agents mix AsyncResult and flag-based checks, creating logic bugs |

## Cross-References

| From | To | Why |
| ---- | -- | --- |
| getting-started | asyncresult-handling | Setup completes when composables are created; immediately need to handle results |
| writing-queries | cache-management | Understanding caching strategy informs staleTime choices |
| writing-mutations | cache-management | Every mutation needs to know which queries to invalidate |
| optimistic-uis | asyncresult-handling | Rollback pattern requires pattern matching on mutation result state |
| optimistic-uis | writing-mutations | Optimistic updates wrap mutations; need to understand mutation result |
| writing-infinitequeries | writing-queries | Infinite queries are queries; all query-level concepts apply |
| foundations | asyncresult-handling | Understanding neverthrow Result types illuminates why AsyncResult is safe |

## Subsystems & Reference Candidates

| Skill | Subsystems | Reference Candidates |
| ----- | ---------- | -------------------- |
| writing-infinitequeries | Offset Pagination, Keyset Pagination | Pagination patterns (offset vs cursor trade-offs) |
| cache-management | — | QueryClient API surface (get/set/update/invalidate with type signatures) |

## Recommended Skill File Structure

**Framework skills:** Vue 3 specific (all skills)

**Core skills:** 
- getting-started (setup/initialization)
- handling-asyncresult-types (result handling)
- writing-queries (data fetching)
- writing-infinitequeries (pagination)
- writing-mutations (data mutations)
- cache-management (cache operations)
- understanding-foundations (conceptual grounding)

**Composition skills:**
- building-optimistic-uis (combining multiple concepts)

**Reference files:**
- References for writing-infinitequeries subsystems (offset vs keyset patterns)
- References for cache-management API surface

## Composition Opportunities

| Library | Integration Points | Composition Skill Needed? |
| ------- | ------------------ | ----------------------- |
| neverthrow | Result/AsyncResult types; error handling patterns | No — foundational type, integrated into library |
| @tanstack/vue-query | QueryClient, caching, background refetch | Partial — library wraps it; understand docs for advanced patterns |
| Vue 3 | Reactivity (Ref, Computed, watch) | No — obvious, but worth emphasizing params must be computed refs |

## Remaining Gaps

| Skill | Question | Status |
| ----- | --------- | ------ |
| building-optimistic-uis | What error scenarios should trigger rollback vs graceful degradation? | deferred |
| writing-infinitequeries | When should developers use offset vs keyset? | resolved |
| cache-management | How to handle cascade invalidation for related entities? | resolved |
