---
name: writing-mutations
description: >
  Create, update, delete resources using useMutation, typed queryKeysToInvalidate with optional param extractors, AsyncResult error handling, execute function, request shape with body/params separation.
type: core
library: vue-core-api-utils
library_version: "1.2.0"
sources:
  - "wisemen-digital/wisemen-core:packages/web/api-utils/src/composables/mutation/mutation.composable.ts"
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

Every mutation should list which queries to invalidate via `queryKeysToInvalidate`.

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
    if ('errors' in error && error.errors[0].code === 'EMAIL_EXISTS') {
      toast.error('That email is already registered')
    } else {
      toast.error('Creation failed')
    }
  }
}
```

Always `await execute()` and check the result state before continuing.

### Update mutation with specific query invalidation using param extractors

When you need to invalidate a specific query (rather than all queries with a key), pass param extractor functions:

```typescript
export function useUpdateContact() {
  return useMutation<ContactUpdateForm, Contact, { contactUuid: string }>({
    queryFn: async (options) => {
      return await ContactService.update(options.params.contactUuid, options.body)
    },
    queryKeysToInvalidate: {
      // Invalidate only the specific contact that was updated
      contactDetail: {
        contactUuid: (params) => params.contactUuid,
      },
      // Invalidate all contact lists
      contactList: {},
    },
  })
}
```

Param extractors receive `(mutationParams, responseData)` and return the value for that query param. Empty object `{}` invalidates all queries with that key.

### Mutation with URL params only (no body)

```typescript
export function useDeleteContact() {
  return useMutation<void, void, { contactUuid: string }>({
    queryFn: async (options) => {
      return await ContactService.delete(options.params.contactUuid)
    },
    queryKeysToInvalidate: {
      contactList: {},
    },
  })
}

// execute({ params: { contactUuid: '123' } })
```

When `TReqData` is `void`, the `execute` call takes `{ params: TParams }` instead of `{ body, params }`.

### Form integration

```vue
<script setup lang="ts">
import { reactive } from 'vue'
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
      Error: {{ result.getError().errors?.[0]?.detail }}
    </div>
  </form>
</template>
```

Use `result.isLoading()` to disable the button during mutation.

## Common Mistakes

### CRITICAL: Import useMutation from @tanstack/vue-query instead of your api module

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
// ✅ Correct: use the composable from your api module
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

Direct TanStack import loses type safety and AsyncResult wrapping.

Source: `src/composables/mutation/mutation.composable.ts`

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

If you don't list which queries to invalidate, the cache stays stale and the UI shows outdated data.

Source: `src/composables/mutation/mutation.composable.ts` — `onSuccess` invalidation logic

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

Not awaiting `execute()` means the mutation is still in flight when you navigate away or access the result.

Source: `src/composables/mutation/mutation.composable.ts` — `execute` returns `Promise<ApiResult>`

### HIGH: Use body instead of params for URL parameters

```typescript
// ❌ Wrong: URL params passed as body
const { execute } = useMutation<SearchForm, Results, void>({
  queryFn: async (options) => {
    return await SearchService.search(options.body) // URL params shouldn't be in body
  },
})
```

```typescript
// ✅ Correct: separate body (payload) from params (URL query string)
const { execute } = useMutation<SearchForm, Results, { category: string }>({
  queryFn: async (options) => {
    const { body, params } = options
    return await SearchService.search(body, params.category)
  },
})

// Call with both:
execute({ body: searchForm, params: { category: 'contacts' } })
```

`body` is for the request payload (POST/PUT body); `params` is for URL query string parameters. The `RequestParams` type enforces this shape automatically based on your generics.

Source: `src/composables/mutation/mutation.composable.ts` — `RequestParams` type

## See Also

- [Cache Management](../cache-management/SKILL.md) — Understanding which queries to invalidate
- [Writing Queries](../writing-queries/SKILL.md) — Mutations invalidate queries; understand queries first
