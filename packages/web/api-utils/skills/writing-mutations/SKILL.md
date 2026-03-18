---
name: writing-mutations
description: >
  Create, update, delete resources using factory-provided useMutation, typed queryKeysToInvalidate, AsyncResult error handling, execute function, request shape with body/params separation.
type: core
library: vue-core-api-utils
library_version: "0.0.3"
sources:
  - "wisemen-digital/wisemen-core:docs/packages/api-utils/pages/usage/mutation.md"
  - "wisemen-digital/wisemen-core:packages/web/api-utils/src/composables/mutation/mutation.composable.ts"
  - "wisemen-digital/wisemen-core:packages/web/api-utils/src/factory/createApiMutationUtils.ts"
---

# @wisemen/vue-core-api-utils — Writing Mutations

Create, update, and delete resources. Mutations automatically invalidate affected queries and return AsyncResult for explicit error handling.

## Setup

```typescript
import { useMutation } from '@/api'
import { ContactService } from '@/services'

export function useCreateContact() {
  return useMutation({
    queryFn: async (options: { body: ContactCreateForm }) => {
      return await ContactService.create(options.body)
    },
    queryKeysToInvalidate: {
      contactList: {}, // Invalidate all contactList queries
    },
  })
}
```

Every mutation must list which queries to invalidate via `queryKeysToInvalidate`.

## Core Patterns

### Execute a mutation and handle the result

```typescript
import { useCreateContact } from '@/composables'

const { execute, result } = useCreateContact()

async function handleSubmit(formData: ContactCreateForm) {
  const response = await execute({ body: formData })
  
  if (response.isOk()) {
    console.log('Created contact:', response.getValue())
    // Invalidated queries will refetch automatically
  } else if (response.isErr()) {
    const error = response.getError()
    // Handle error based on code
    if (error.errors[0].code === 'EMAIL_EXISTS') {
      toast.error('That email is already registered')
    } else {
      toast.error('Creation failed')
    }
  }
}
```

Always `await execute()` and check the result state before continuing.

### Update mutation with specific query invalidation

```typescript
export function useUpdateContact(contactUuid: string) {
  return useMutation({
    queryFn: async (options: { body: ContactUpdateForm }) => {
      return await ContactService.update(contactUuid, options.body)
    },
    queryKeysToInvalidate: {
      contactDetail: {}, // Invalidate the specific contact
      contactList: {},   // And the list
    },
  })
}
```

You can invalidate multiple queries. Include queries that depend on the data you're changing.

### Form integration

```vue
<script setup lang="ts">
import { ref } from 'vue'
import { useCreateContact } from '@/composables'

const form = reactive({ name: '', email: '' })
const { execute, result } = useCreateContact()

async function handleSubmit() {
  const response = await execute({ body: form })
  
  if (response.isOk()) {
    router.push('/contacts')
  }
  // If isErr, form stays visible for user to retry
}
</script>

<template>
  <form @submit.prevent="handleSubmit">
    <input v-model="form.name" />
    <input v-model="form.email" />
    <button :disabled="result.isLoading()">
      {{ result.isLoading() ? 'Creating...' : 'Create' }}
    </button>
    <div v-if="result.isErr()">
      Error: {{ result.getError().errors[0].detail }}
    </div>
  </form>
</template>
```

Use `result.isLoading()` to disable the button during mutation.

## Common Mistakes

### CRITICAL: Import useMutation from @tanstack/vue-query instead of factory

```typescript
// ❌ Wrong: using TanStack directly
import { useMutation } from '@tanstack/vue-query'

const mutation = useMutation({
  mutationFn: async (data) => ContactService.create(data),
  onSuccess: () => {
    queryClient.invalidateQueries({ queryKey: ['contactList'] })
  },
})
// Loses AsyncResult, type safety, error codes
```

```typescript
// ✅ Correct: use factory composable
import { useMutation } from '@/api'

const { execute, result } = useMutation({
  queryFn: async (options: { body: ContactCreateForm }) => {
    return await ContactService.create(options.body)
  },
  queryKeysToInvalidate: {
    contactList: {}, // Typed, type-safe
  },
})
// Full AsyncResult, type-safe queryKeysToInvalidate, error codes
```

Direct TanStack import loses the factory's type safety and AsyncResult wrapping.

Source: Library architecture — always use composables from `createApiUtils()` factory

### CRITICAL: Forget to list queryKeysToInvalidate; cache becomes stale

```typescript
// ❌ Wrong: no queryKeysToInvalidate
const { execute } = useMutation({
  queryFn: async (options: { body: ContactCreateForm }) => {
    return await ContactService.create(options.body)
  },
  // Forgot queryKeysToInvalidate!
})
// Mutation succeeds but list query still shows old data
```

```typescript
// ✅ Correct: invalidate affected queries
const { execute } = useMutation({
  queryFn: async (options: { body: ContactCreateForm }) => {
    return await ContactService.create(options.body)
  },
  queryKeysToInvalidate: {
    contactList: {}, // Invalidate all contactList queries
  },
})
// After success, contactList queries refetch
```

If you don't list which queries to invalidate, the cache stays stale and the UI shows outdated data. Update returns success but list still shows old items.

Source: `docs/packages/api-utils/pages/usage/mutation.md` Create Mutation Example

### HIGH: Not await execute(); code runs before mutation completes

```typescript
// ❌ Wrong: fire and forget
async function handleSubmit() {
  execute({ body: formData })
  router.push('/contacts') // Redirects before mutation finishes!
}
```

```typescript
// ✅ Correct: await the result
async function handleSubmit() {
  const result = await execute({ body: formData })
  if (result.isOk()) {
    router.push('/contacts')
  }
  // If isErr, form stays visible for retry
}
```

Not awaiting `execute()` means the mutation is still in flight when you navigate away or access the result. Always await and check the result before continuing.

Source: `docs/packages/api-utils/pages/usage/mutation.md` Usage in Component

### HIGH: Use body instead of params for query parameters

```typescript
// ❌ Wrong: filter/search as body
const { execute } = useMutation({
  queryFn: async (options) => {
    return await SearchService.search(options.body) // params should go in URL!
  },
})
```

```typescript
// ✅ Correct: separate body and params
const { execute } = useMutation({
  queryFn: async (options) => {
    const { body, params } = options
    return await SearchService.search(params) // URL params
  },
})
```

When mutations accept query parameters (filters, search), pass them in the `params` field of the options, not `body`. `body` is for request payload; `params` is for URL query string.

Source: Source code `mutation.composable.ts` — request shape documentation

## See Also

- [Cache Management](../cache-management/SKILL.md) — Understanding which queries to invalidate
- [Writing Queries](../writing-queries/SKILL.md) — Mutations invalidate queries; understand queries first
