---
name: optimistic-uis
description: >
  Combining mutations, cache updates, and AsyncResult to create responsive UIs with instant feedback; optimistic updates with error handling, async transitions, immediate user feedback without request latency.
type: core
library: vue-core-api-utils
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
