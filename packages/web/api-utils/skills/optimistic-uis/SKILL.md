---
name: optimistic-uis
description: >
  Combining mutations, cache updates, and AsyncResult to create responsive UIs with instant feedback; optimistic updates with error handling, async transitions, immediate user feedback without request latency.
type: core
library: vue-core-api-utils
library_version: "0.0.3"
sources:
  - "wisemen-digital/wisemen-core:docs/packages/api-utils/pages/usage/mutation.md"
  - "wisemen-digital/wisemen-core:docs/packages/api-utils/pages/usage/query-client.md"
  - "wisemen-digital/wisemen-core:packages/web/api-utils/src/composables/mutation/mutation.composable.ts"
  - "wisemen-digital/wisemen-core:packages/web/api-utils/src/utils/query-client/queryClient.ts"
---

# @wisemen/vue-core-api-utils — Optimistic UIs

Create fast, responsive UIs by updating the cache immediately while mutations execute in the background. Combine `useMutation()`, `useQueryClient()`, and `AsyncResult` pattern matching to provide instant feedback to users.

## Setup

```typescript
import { useMutation, useQueryClient, useQuery } from '@/api'
import { computed } from 'vue'

const queryClient = useQueryClient()
const { result: contact } = useQuery('contactDetail', {
  params: {
    contactUuid: computed(() => contactUuid),
  },
  queryFn: () => ContactService.getDetail(contactUuid),
})

const { execute, isLoading, result: mutationResult } = useMutation({
  queryFn: ({ body }) => ContactService.updateContact(contactUuid, body),
  queryKeysToInvalidate: { contactList: {} },
})

async function handleSubmit(formData) {
  // Save original (for rollback)
  const originalContact = contact.value.isOk() ? contact.value.getValue() : null
  
  // Optimistic update: immediate cache change
  queryClient.update(['contactDetail', { contactUuid }], {
    by: (c) => true,
    value: (c) => ({ ...c, ...formData }),
  })
  
  // Execute mutation
  const result = await execute(formData)
  
  // On error, rollback
  if (result.isErr()) {
    queryClient.set(['contactDetail', { contactUuid }], originalContact)
  }
}
```

## Core Patterns

### Immediate cache update while request pending

```typescript
const { result } = useQuery('contactDetail', {
  params: computed(() => ({ contactUuid })),
  queryFn: () => ContactService.getDetail(contactUuid),
})

const { execute, isLoading } = useMutation({
  queryFn: (data) => ContactService.updateContact(contactUuid, data),
  queryKeysToInvalidate: { /* ... */ },
})

async function handleSave(formData) {
  // Cache update happens immediately
  queryClient.update(['contactDetail', { contactUuid }], {
    by: (c) => true,
    value: (c) => ({ ...c, ...formData }),
  })
  
  // Mutation executes in background
  await execute(formData)
  
  // UI shows updated data from cache right away
  // isLoading is true while request pending
  // result.value changes when mutation completes
}
```

Users see changes instantly. `isLoading` stays true during request, giving visual feedback. No perceived latency.

### Error handling with AsyncResult

```typescript
async function handleSave(formData) {
  const originalContact = contact.value?.getValue()
  
  queryClient.update(['contactDetail', { contactUuid }], {
    by: (c) => true,
    value: (c) => ({ ...c, ...formData }),
  })
  
  const result = await execute(formData)
  
  // Match on mutation result
  result.match({
    ok: () => {
      // Server confirmed the update
      // Cache already reflects the change
      showSuccessMessage('Contact updated')
    },
    err: (error) => {
      // Revert optimistic update
      queryClient.set(['contactDetail', { contactUuid }], originalContact)
      showErrorMessage(`Failed: ${error.message}`)
    },
    loading: () => {
      // Should not happen after await, but handle just in case
    },
  })
}
```

When mutation fails, revert the optimistic change using the saved original value.

### Composable combining query + mutation + optimistic UI

```typescript
export function useContactEditor(contactUuid) {
  const queryClient = useQueryClient()
  
  const { result: contact } = useQuery('contactDetail', {
    params: computed(() => ({ contactUuid })),
    queryFn: () => ContactService.getDetail(contactUuid),
  })
  
  const { execute, isLoading, result: mutationResult } = useMutation({
    queryFn: (data) => ContactService.updateContact(contactUuid, data),
    queryKeysToInvalidate: {
      contactList: () => true,
      'contact-stats': () => true,
    },
  })
  
  async function saveContact(formData) {
    const original = contact.value?.getValue()
    
    // Optimistic
    queryClient.update(['contactDetail', { contactUuid }], {
      by: () => true,
      value: (c) => ({ ...c, ...formData }),
    })
    
    // Execute
    const result = await execute(formData)
    
    // Rollback on error
    if (result.isErr()) {
      queryClient.set(['contactDetail', { contactUuid }], original)
    }
    
    return result
  }
  
  return {
    contact,
    saveContact,
    isLoading,
    mutationResult,
  }
}
```

Encapsulate the full flow in a composable for reusability across components.

## Common Mistakes

### HIGH: Forget to save original data before optimistic update; can't rollback on error

```typescript
// ❌ Wrong: no original saved, rollback impossible
const { execute, result } = useMutation({
  queryFn: (data) => ContactService.updateContact(data),
  queryKeysToInvalidate: { contactList: () => true },
})

async function handleSave(formData) {
  // Update cache immediately
  queryClient.update(['contactDetail', { contactUuid }], {
    by: () => true,
    value: (c) => ({ ...c, ...formData }),
  })
  
  const result = await execute(formData)
  
  if (result.isErr()) {
    // No way to undo the optimistic change!
    showErrorMessage('Save failed')
  }
}
```

```typescript
// ✅ Correct: save original before update
async function handleSave(formData) {
  // Save original FIRST
  const originalContact = contact.value?.getValue()
  
  // Update cache
  queryClient.update(['contactDetail', { contactUuid }], {
    by: () => true,
    value: (c) => ({ ...c, ...formData }),
  })
  
  const result = await execute(formData)
  
  if (result.isErr()) {
    // Restore original
    queryClient.set(['contactDetail', { contactUuid }], originalContact)
    showErrorMessage('Save failed, changes reverted')
  }
}
```

Always save the current value before modifying the cache. Use it to rollback if the mutation fails.

Source: `docs/packages/api-utils/pages/usage/query-client.md` Real-World Example

### CRITICAL: Handle stale optimistic updates; if component unmounts, optimistic change remains in cache

```typescript
// ❌ Wrong: optimistic update lives in cache even if user navigates away
async function handleSave(formData) {
  const originalContact = contact.value?.getValue()
  
  queryClient.update(['contactDetail', { contactUuid }], {
    by: () => true,
    value: (c) => ({ ...c, ...formData }),
  })
  
  // User navigates away while mutation pending
  // Cache still has optimistic data
  // When user returns, data is stale
  const result = await execute(formData)
  if (result.isErr()) {
    // Rollback happens but user is gone
    queryClient.set(['contactDetail', { contactUuid }], originalContact)
  }
}
```

```typescript
// ✅ Correct: clear optimistic flag or track mutation completion
import { onUnmounted } from 'vue'

let originalContact = null
let isSaving = false

async function handleSave(formData) {
  originalContact = contact.value?.getValue()
  isSaving = true
  
  queryClient.update(['contactDetail', { contactUuid }], {
    by: () => true,
    value: (c) => ({ ...c, ...formData }),
  })
  
  const result = await execute(formData)
  isSaving = false
  
  if (result.isErr() && originalContact) {
    queryClient.set(['contactDetail', { contactUuid }], originalContact)
  }
}

onUnmounted(() => {
  // If still saving and user leaves, rollback
  if (isSaving && originalContact) {
    queryClient.set(['contactDetail', { contactUuid }], originalContact)
  }
})
```

If user navigates away while a mutation is pending, rollback the optimistic change using component lifecycle hooks. Otherwise, stale data persists in the cache.

Source: Architectural consideration from cache invalidation patterns

### HIGH: Miss querying the correct data structure; optimistic update patches wrong field

```typescript
// ❌ Wrong: update assuming flat entity, but query returns paginated structure
const { result: paginatedContacts } = useQuery('contactList', {
  params: computed(() => ({ limit: 20, offset: 0 })),
  queryFn: () => ContactService.list({ limit: 20, offset: 0 }),
})

queryClient.update('contactList', {
  by: (contact) => contact.id === '123',
  value: (contact) => ({ ...contact, name: 'Updated' }),
})
// This fails because contactList is not Contact[] but { data: Contact[], meta: {...} }
```

```typescript
// ✅ Correct: QueryClient handles nested structures automatically
const { result: paginatedContacts } = useQuery('contactList', {
  params: computed(() => ({ limit: 20, offset: 0 })),
  queryFn: () => ContactService.list({ limit: 20, offset: 0 }),
})

// QueryClient infers the data structure from query keys
// If contactList query returns { data: Contact[], meta: {...} }
// QueryClient knows to iterate contact.data and apply the predicate
queryClient.update('contactList', {
  by: (contact) => contact.id === '123',
  value: (contact) => ({ ...contact, name: 'Updated' }),
})
```

QueryClient automatically extracts the entity from nested query results (`{ data: [...], meta: {...} }`). You work with the flattened entity, QueryClient handles the nesting. This is why checking your query key definition matters.

Source: `packages/web/api-utils/src/utils/query-client/queryClient.ts`

### MEDIUM: Race condition: multiple mutations affect the same query, order matters

```typescript
// ❌ Wrong: two mutations in flight affecting the same cache
async function handleMultipleSaves() {
  // Mutation 1: add tag
  queryClient.update(['contactDetail', { contactUuid }], {
    by: () => true,
    value: (c) => ({ ...c, tags: [...c.tags, 'new-tag'] }),
  })
  const result1 = await execute({ tags: [...contact.value.tags, 'new-tag'] })
  
  // Mutation 2: change name
  // But Mutation 1 is still in flight!
  queryClient.update(['contactDetail', { contactUuid }], {
    by: () => true,
    value: (c) => ({ ...c, name: 'Updated' }),
  })
  const result2 = await execute({ name: 'Updated' })
  
  // If Mutation 2 completes before Mutation 1, the tags are lost
}
```

```typescript
// ✅ Correct: serialize mutations or track multiple originals
async function handleMultipleSaves() {
  const original = contact.value?.getValue()
  
  // Either: await each mutation before starting the next
  queryClient.update(['contactDetail', { contactUuid }], {
    by: () => true,
    value: (c) => ({ ...c, tags: [...c.tags, 'new-tag'] }),
  })
  const result1 = await execute({ tags: [...contact.value.tags, 'new-tag'] })
  if (result1.isErr()) {
    queryClient.set(['contactDetail', { contactUuid }], original)
    return
  }
  
  // Now safe to do second mutation
  const updatedOriginal = queryClient.get(['contactDetail', { contactUuid }])
  queryClient.update(['contactDetail', { contactUuid }], {
    by: () => true,
    value: (c) => ({ ...c, name: 'Updated' }),
  })
  const result2 = await execute({ name: 'Updated' })
  if (result2.isErr()) {
    queryClient.set(['contactDetail', { contactUuid }], updatedOriginal)
  }
}
```

Mutations should be serialized (one at a time) or you need to track the state after each optimistic update. Concurrent mutations on the same cache lead to lost updates.

Source: Architectural consideration from query lifecycle patterns

## Rollback Strategy

Rollback is enabled by saving the original data before the optimistic update:

```typescript
const original = contact.value?.getValue()
queryClient.update(['contactDetail', { contactUuid }], {
  by: () => true,
  value: (c) => ({ ...c, ...formData }),
})
const result = await execute(formData)
if (result.isErr()) {
  queryClient.set(['contactDetail', { contactUuid }], original)
}
```

However, rollback patterns for complex scenarios (partial field updates, nested objects) are being refined in the library. For now, save and restore the entire entity.

## See Also

- [Writing Mutations](../writing-mutations/SKILL.md) — The `execute()` and result handling that pairs with optimistic updates
- [Cache Management](../cache-management/SKILL.md) — QueryClient methods for reading and updating cache
- [Writing Queries](../writing-queries/SKILL.md) — Understanding query results and caching behavior
