---
name: optimistic-uis
description: >
  Combining mutations, QueryClient.update() with built-in rollback, and AsyncResult to create responsive UIs with instant feedback; optimistic updates with automatic error reversal.
type: core
library: vue-core-api-utils
library_version: "1.2.0"
sources:
  - "wisemen-digital/wisemen-core:packages/web/api-utils/src/composables/mutation/mutation.composable.ts"
  - "wisemen-digital/wisemen-core:packages/web/api-utils/src/utils/query-client/queryClient.ts"
---

# @wisemen/vue-core-api-utils — Optimistic UIs

Create fast, responsive UIs by updating the cache immediately while mutations execute in the background. Combine `useMutation()`, `QueryClient`, and `AsyncResult` pattern matching to provide instant feedback to users.

## Setup

```typescript
// src/api/queryClient.ts
import { QueryClient, getTanstackQueryClient } from '@wisemen/vue-core-api-utils'
import type { ProjectQueryKeys } from '@/types/queryKey.type'

export function useQueryClient() {
  return new QueryClient<ProjectQueryKeys>(getTanstackQueryClient())
}
```

```typescript
import { useQuery, useMutation } from '@/api'
import { useQueryClient } from '@/api/queryClient'
import { computed } from 'vue'

const queryClient = useQueryClient()

const { result: contact } = useQuery('contactDetail', {
  params: {
    contactUuid: computed(() => contactUuid),
  },
  queryFn: () => ContactService.getDetail(contactUuid),
})

const { execute, result: mutationResult } = useMutation({
  queryFn: ({ body }) => ContactService.updateContact(contactUuid, body),
  queryKeysToInvalidate: { contactList: {} },
})

async function handleSubmit(formData) {
  // Optimistic update — returns rollback function
  const { rollback } = queryClient.update(['contactDetail', { contactUuid }] as const, {
    by: () => true,
    value: (c) => ({ ...c, ...formData }),
  })
  
  // Execute mutation
  const result = await execute({ body: formData })
  
  // Revert cache on error
  if (result.isErr()) {
    rollback()
  }
}
```

## Core Patterns

### Immediate cache update while request pending

```typescript
const queryClient = useQueryClient()

const { execute } = useMutation({
  queryFn: (data) => ContactService.updateContact(contactUuid, data),
  queryKeysToInvalidate: { contactList: {} },
})

async function handleSave(formData) {
  // Cache update happens immediately — UI shows new data right away
  const { rollback } = queryClient.update(['contactDetail', { contactUuid }] as const, {
    by: () => true,
    value: (c) => ({ ...c, ...formData }),
  })
  
  // Mutation executes in background
  const result = await execute({ body: formData })
  
  // On error, revert to the previous state
  if (result.isErr()) {
    rollback()
  }
}
```

Users see changes instantly. No perceived latency. If the server rejects the change, `rollback()` restores the previous cache state automatically.

### Error handling with AsyncResult

```typescript
async function handleSave(formData) {
  const { rollback } = queryClient.update(['contactDetail', { contactUuid }] as const, {
    by: () => true,
    value: (c) => ({ ...c, ...formData }),
  })
  
  const result = await execute({ body: formData })
  
  result.match({
    ok: () => {
      // Server confirmed the update
      // Cache already reflects the change from the optimistic update
      showSuccessMessage('Contact updated')
    },
    err: (error) => {
      // Revert optimistic update
      rollback()
      showErrorMessage(`Failed: ${'errors' in error ? error.errors[0].detail : error.message}`)
    },
    loading: () => {
      // Won't happen after await, but required by match()
    },
  })
}
```

### Composable combining query + mutation + optimistic UI

```typescript
export function useContactEditor(contactUuid: string) {
  const queryClient = useQueryClient()
  
  const { result: contact } = useQuery('contactDetail', {
    params: computed(() => ({ contactUuid })),
    queryFn: () => ContactService.getDetail(contactUuid),
  })
  
  const { execute, result: mutationResult } = useMutation({
    queryFn: ({ body }) => ContactService.updateContact(contactUuid, body),
    queryKeysToInvalidate: {
      contactList: {},
    },
  })
  
  async function saveContact(formData) {
    // Optimistic update
    const { rollback } = queryClient.update(['contactDetail', { contactUuid }] as const, {
      by: () => true,
      value: (c) => ({ ...c, ...formData }),
    })
    
    // Execute
    const result = await execute({ body: formData })
    
    // Rollback on error
    if (result.isErr()) {
      rollback()
    }
    
    return result
  }
  
  return {
    contact,
    saveContact,
    mutationResult,
  }
}
```

Encapsulate the full flow in a composable for reusability across components.

## Common Mistakes

### HIGH: Ignore the rollback return from update(); can't revert on error

```typescript
// ❌ Wrong: discarding rollback
async function handleSave(formData) {
  queryClient.update(['contactDetail', { contactUuid }] as const, {
    by: () => true,
    value: (c) => ({ ...c, ...formData }),
  })
  // rollback discarded!
  
  const result = await execute({ body: formData })
  
  if (result.isErr()) {
    // No way to undo the optimistic change!
    showErrorMessage('Save failed')
    // UI now shows wrong data permanently
  }
}
```

```typescript
// ✅ Correct: capture and use rollback
async function handleSave(formData) {
  const { rollback } = queryClient.update(['contactDetail', { contactUuid }] as const, {
    by: () => true,
    value: (c) => ({ ...c, ...formData }),
  })
  
  const result = await execute({ body: formData })
  
  if (result.isErr()) {
    rollback() // Restores previous state automatically
    showErrorMessage('Save failed, changes reverted')
  }
}
```

`update()` captures the previous state internally and exposes it via `rollback()`. Always capture and use it when doing optimistic updates.

Source: `src/utils/query-client/queryClient.ts` — `QueryClientUpdateResult`

### CRITICAL: Stale optimistic update if component unmounts during pending mutation

```typescript
// ❌ Wrong: mutation pending, user navigates away, rollback never called
async function handleSave(formData) {
  const { rollback } = queryClient.update(['contactDetail', { contactUuid }] as const, {
    by: () => true,
    value: (c) => ({ ...c, ...formData }),
  })
  
  // User navigates away while mutation is pending
  // Cache still has optimistic data
  const result = await execute({ body: formData })
  if (result.isErr()) {
    rollback() // User is gone — rollback still works but user won't see it
  }
}
```

```typescript
// ✅ Correct: rollback on unmount if mutation is still in flight
import { onUnmounted } from 'vue'

let pendingRollback: (() => void) | null = null

async function handleSave(formData) {
  const { rollback } = queryClient.update(['contactDetail', { contactUuid }] as const, {
    by: () => true,
    value: (c) => ({ ...c, ...formData }),
  })
  pendingRollback = rollback
  
  const result = await execute({ body: formData })
  pendingRollback = null
  
  if (result.isErr()) {
    rollback()
  }
}

onUnmounted(() => {
  // If still saving and user leaves, rollback stale optimistic update
  pendingRollback?.()
})
```

If the user navigates away while a mutation is pending, rollback the optimistic change using component lifecycle hooks. Otherwise, stale unconfirmed data persists in the global cache.

Source: Architectural consideration from cache invalidation patterns

### HIGH: Optimistic update on list query with wrong predicate; patches wrong item

```typescript
// ❌ Wrong: update without proper predicate
queryClient.update('contactList', {
  by: () => true, // Matches ALL contacts in the list!
  value: (c) => ({ ...c, name: 'Updated' }),
})
// Every contact in the cached list gets "Updated" as name
```

```typescript
// ✅ Correct: use a specific predicate
queryClient.update('contactList', {
  by: (contact) => contact.uuid === contactUuid, // Only match the specific item
  value: (contact) => ({ ...contact, name: formData.name }),
})
```

When updating lists, always use a predicate that uniquely identifies the item you're changing. `by: () => true` is only appropriate for single-entity queries.

Source: `src/utils/query-client/queryClient.ts` — `updateEntity` iterates arrays

### MEDIUM: Race condition: multiple mutations affect the same query

```typescript
// ❌ Wrong: two mutations in flight affecting the same cache
async function handleMultipleSaves() {
  // Mutation 1 optimistic update
  const { rollback: rollback1 } = queryClient.update(['contactDetail', { contactUuid }] as const, {
    by: () => true,
    value: (c) => ({ ...c, tags: [...c.tags, 'new-tag'] }),
  })
  // Don't await — start Mutation 2 immediately!
  execute1({ body: { tags: [...contact.tags, 'new-tag'] } })
  
  // Mutation 2 on same cache entry
  const { rollback: rollback2 } = queryClient.update(['contactDetail', { contactUuid }] as const, {
    by: () => true,
    value: (c) => ({ ...c, name: 'Updated' }),
  })
  await execute2({ body: { name: 'Updated' } })
  
  // If Mutation 2 completes before Mutation 1, the tags may be lost
}
```

```typescript
// ✅ Correct: serialize mutations to avoid ordering issues
async function handleMultipleSaves() {
  const { rollback: rollback1 } = queryClient.update(['contactDetail', { contactUuid }] as const, {
    by: () => true,
    value: (c) => ({ ...c, tags: [...c.tags, 'new-tag'] }),
  })
  const result1 = await execute1({ body: { tags: [...contact.tags, 'new-tag'] } })
  if (result1.isErr()) {
    rollback1()
    return
  }
  
  // Only start Mutation 2 after Mutation 1 finishes
  const { rollback: rollback2 } = queryClient.update(['contactDetail', { contactUuid }] as const, {
    by: () => true,
    value: (c) => ({ ...c, name: 'Updated' }),
  })
  const result2 = await execute2({ body: { name: 'Updated' } })
  if (result2.isErr()) {
    rollback2()
  }
}
```

Serialize mutations that affect the same cache entry. Concurrent mutations on the same key can lead to lost updates or incorrect rollbacks.

Source: Architectural consideration from query lifecycle patterns

## See Also

- [Writing Mutations](../writing-mutations/SKILL.md) — The `execute()` and result handling that pairs with optimistic updates
- [Cache Management](../cache-management/SKILL.md) — QueryClient methods for reading and updating cache
- [Writing Queries](../writing-queries/SKILL.md) — Understanding query results and caching behavior
