---
name: writing-mutations
description: >
  Create, update, delete resources using factory-provided useMutation, typed queryKeysToInvalidate, AsyncResult error handling, execute function, request shape with body/params separation.
type: core
library: vue-core-api-utils
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

## See Also

- [Cache Management](../cache-management/SKILL.md) — Understanding which queries to invalidate
- [Writing Queries](../writing-queries/SKILL.md) — Mutations invalidate queries; understand queries first
