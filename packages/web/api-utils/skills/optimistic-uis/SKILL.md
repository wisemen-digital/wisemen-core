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
  queryFn: ({ body }: { body: ContactUpdateForm }) =>
    ContactService.updateContact(contactUuid, body),
  queryKeysToInvalidate: { contactList: {} },
})

async function handleSubmit(formData: ContactUpdateForm) {
  // Optimistic update — returns { rollback } for reverting on error
  const { rollback } = queryClient.update(['contactDetail', { contactUuid }], {
    by: (c) => true,
    value: (c) => ({ ...c, ...formData }),
  })
  
  // Execute mutation
  const result = await execute({ body: formData })
  
  // On error, rollback
  if (result.isErr()) {
    rollback()
  }
}
```

## Core Patterns

### Immediate cache update while request pending

```typescript
const queryClient = useQueryClient()

const { result } = useQuery('contactDetail', {
  params: { contactUuid: computed(() => contactUuid) },
  queryFn: () => ContactService.getDetail(contactUuid),
})

const { execute, isLoading } = useMutation({
  queryFn: ({ body }: { body: ContactUpdateForm }) =>
    ContactService.updateContact(contactUuid, body),
  queryKeysToInvalidate: { contactList: {} },
})

async function handleSave(formData: ContactUpdateForm) {
  // Cache update happens immediately, rollback returned for error case
  const { rollback } = queryClient.update(['contactDetail', { contactUuid }], {
    by: (c) => true,
    value: (c) => ({ ...c, ...formData }),
  })
  
  // Mutation executes in background
  const result = await execute({ body: formData })
  
  if (result.isErr()) {
    rollback()
  }
}
```

Users see changes instantly. `isLoading` stays true during request, giving visual feedback. No perceived latency.

### Error handling with AsyncResult

```typescript
async function handleSave(formData: ContactUpdateForm) {
  const queryClient = useQueryClient()

  const { rollback } = queryClient.update(['contactDetail', { contactUuid }], {
    by: (c) => true,
    value: (c) => ({ ...c, ...formData }),
  })
  
  const result = await execute({ body: formData })
  
  if (result.isOk()) {
    showSuccessMessage('Contact updated')
  } else if (result.isErr()) {
    rollback()
    const error = result.getError()
    if ('errors' in error) {
      showErrorMessage(`Failed: ${error.errors[0].detail}`)
    } else {
      showErrorMessage('An unexpected error occurred')
    }
  }
}
```

When mutation fails, call `rollback()` to revert the optimistic cache change. Narrow the error type with `'errors' in error` to distinguish expected API errors from unexpected ones.

### Composable combining query + mutation + optimistic UI

```typescript
export function useContactEditor(contactUuid: string) {
  const queryClient = useQueryClient()
  
  const { result: contact } = useQuery('contactDetail', {
    params: { contactUuid: computed(() => contactUuid) },
    queryFn: () => ContactService.getDetail(contactUuid),
  })
  
  const { execute, isLoading, result: mutationResult } = useMutation({
    queryFn: ({ body }: { body: ContactUpdateForm }) =>
      ContactService.updateContact(contactUuid, body),
    queryKeysToInvalidate: {
      contactList: {},
    },
  })
  
  async function saveContact(formData: ContactUpdateForm) {
    const { rollback } = queryClient.update(['contactDetail', { contactUuid }], {
      by: () => true,
      value: (c) => ({ ...c, ...formData }),
    })
    
    const result = await execute({ body: formData })
    
    if (result.isErr()) {
      rollback()
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

`queryClient.update()` returns a `{ rollback }` function that reverts the cache to its previous state:

```typescript
const { rollback } = queryClient.update(['contactDetail', { contactUuid }], {
  by: () => true,
  value: (c) => ({ ...c, ...formData }),
})
const result = await execute({ body: formData })
if (result.isErr()) {
  rollback()
}
```

Always use the built-in `rollback()` rather than manually saving and restoring the original data — it handles all edge cases including list updates and concurrent modifications.

## See Also

- [Writing Mutations](../writing-mutations/SKILL.md) — The `execute()` and result handling that pairs with optimistic updates
- [Cache Management](../cache-management/SKILL.md) — QueryClient methods for reading and updating cache
- [Writing Queries](../writing-queries/SKILL.md) — Understanding query results and caching behavior
