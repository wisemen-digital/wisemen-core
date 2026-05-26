# Mutations (Create, Update, Delete)

This example demonstrates how to use `useMutation` from `@wisemen/vue-core-api-utils` to handle data mutations like creating, updating, and deleting resources.

## Create Mutation

```typescript
// src/composables/useCreateContact.ts

import { useMutation } from '@/api'
import { ContactService } from '@/services'

export function useCreateContact() {
  return useMutation({
    queryFn: ({ body }: { body: ContactCreateForm }) => ContactService.create(body),
    queryKeysToInvalidate: {
      contactList: {},
    },
  })
}
```

### Usage in Component

```vue
<script setup lang="ts">
import { useCreateContact } from '@/composables'

const { execute, result } = useCreateContact()

async function handleSubmit(form: ContactCreateForm) {
  const mutationResult = await execute({ body: form })

  if (mutationResult.isOk()) {
    const contactId = mutationResult.value
    console.log('Contact created with ID:', contactId)
    // Redirect or show success message
  }
}
</script>

<template>
  <form @submit.prevent="handleSubmit">
    <input v-model="form.name" placeholder="Contact name" />
    <button :disabled="result.isLoading()">
      {{ result.isLoading() ? 'Creating...' : 'Create' }}
    </button>
    <div v-if="result.isErr()" class="error">
      {{ result.getError().errors[0].detail }}
    </div>
  </form>
</template>
```

## Update Mutation

```typescript
// src/composables/useUpdateContact.ts

import { useMutation } from '@/api'
import { ContactService } from '@/services'

export function useUpdateContact(contactId: string) {
  return useMutation({
    queryFn: ({ body }: { body: ContactUpdateForm }) => ContactService.update(contactId, body),
    queryKeysToInvalidate: {
      contactDetail: {},
      contactList: {},
    },
  })
}
```

### Usage in Component

```vue
<script setup lang="ts">
import { useUpdateContact } from '@/composables'

const props = defineProps<{ contactId: string }>()
const { execute, result } = useUpdateContact(props.contactId)

async function handleSubmit(form: ContactUpdateForm) {
  const mutationResult = await execute({ body: form })

  if (mutationResult.isErr()) {
    console.error('Update failed:', mutationResult.error)
    return
  }

  console.log('Contact updated successfully')
}
</script>

<template>
  <form @submit.prevent="handleSubmit">
    <input v-model="form.name" />
    <button :disabled="result.isLoading()">Save</button>
  </form>
</template>
```

## Delete Mutation

```typescript
// src/composables/useDeleteContact.ts

import { useMutation } from '@/api'
import { ContactService } from '@/services'

export function useDeleteContact() {
  return useMutation({
    queryFn: ({ body: contactId }: { body: string }) => ContactService.delete(contactId),
    queryKeysToInvalidate: {
      contactList: {},
    },
  })
}
```

### Usage in Component

```vue
<script setup lang="ts">
import { useDeleteContact } from '@/composables'

const props = defineProps<{ contactId: string }>()
const { execute, result } = useDeleteContact()

async function handleDelete() {
  if (!confirm('Are you sure?')) return

  const mutationResult = await execute({ body: props.contactId })

  if (mutationResult.isOk()) {
    // Navigate away or show success
  }
}
</script>

<template>
  <button @click="handleDelete" :disabled="result.isLoading()">
    {{ result.isLoading() ? 'Deleting...' : 'Delete' }}
  </button>
</template>
```

## Return Values

- **`result`**: `ComputedRef<AsyncResult<T, E>>` — reactive mutation state
- **`execute`**: Function to trigger the mutation; returns `Promise<ApiResult<T, E>>` (a neverthrow `Result`)
- **`isLoading`** _(deprecated)_: Use `result.value.isLoading()` instead
- **`data`** _(deprecated)_: Use `result.value.getValue()` instead

## Handling Results

Always use the `result` property for error handling:

```typescript
if (result.value.isLoading()) {
  console.log('Mutation in progress...')
}

if (result.value.isOk()) {
  const response = result.value.getValue()
  console.log('Success:', response)
}

if (result.value.isErr()) {
  const error = result.value.getError()
  console.error('Error:', error.code, error.message)
}
```

Or use pattern matching for more concise code:

```typescript
result.value.match({  
  loading: () => console.log('Mutation in progress...'),  
  ok: (data) => console.log('Success:', data),  
  err: (error) => console.error('Error:', error.code, error.message),  
})  

```

## Automatic Cache Invalidation

Mutations can automatically invalidate queries to keep your data in sync:

```typescript
useMutation({
  queryFn: async (body) => { /* ... */ },
  queryKeysToInvalidate: {
    // Invalidate all items in a list
    contactList: {},
    
    // Invalidate a specific detail with dynamic params
    contactDetail: { contactId: 'some-id' },
  },
})
```

## Best Practices

1. **Always handle both success and error** - Use pattern matching or the explicit checks
2. **Show loading state** - Disable buttons and show indicators while executing
3. **Invalidate related queries** - Keep your cache fresh by invalidating affected queries
4. **Transform data in services** - Keep mutations simple and delegate complex logic to services
5. **Validate before sending** - Catch errors early with form validation

### Create Form Example

```vue
<script setup lang="ts">
import { useForm } from 'formango'
import { useRouter } from 'vue-router'
import { useApiErrorToast } from '@/composables/api-error-toast/apiErrorToast.composable'
import { useContactCreateMutation } from '@/modules/contact/api/mutations/contactCreate.mutation'
import { contactCreateFormSchema } from '@/modules/contact/models/contact/create/contactCreateForm.model'

const router = useRouter()
const errorToast = useApiErrorToast()
const contactCreateMutation = useContactCreateMutation()

const form = useForm({
  schema: contactCreateFormSchema,
  onSubmit: async (values) => {
    // Execute the mutation
    const result = await contactCreateMutation.execute({
      body: values,
    })

    // Handle the result using pattern matching
    result.match(
      (contactUuid) => {
        // Success: navigate to the new contact
        router.push({
          name: 'contact-detail',
          params: { contactUuid },
        })
      },
      (error) => {
        // Error: show error toast
        errorToast.show(error)
      },
    )
  },
})
</script>

<template>
  <FormRoot :form="form">
    <VcTextField
      v-bind="toFormField(form.register('firstName'))"
      label="First Name"
    />
    <VcTextField
      v-bind="toFormField(form.register('lastName'))"
      label="Last Name"
    />
    <FormSubmitButton>Create Contact</FormSubmitButton>
  </FormRoot>
</template>
```

### Update Form Example

```vue
<script setup lang="ts">
import { useForm } from 'formango'
import { useRouter } from 'vue-router'
import { useApiErrorToast } from '@/composables/api-error-toast/apiErrorToast.composable'
import { useContactUpdateMutation } from '@/modules/contact/api/mutations/contactUpdate.mutation'
import type { ContactDetail } from '@/modules/contact/models/contact/detail/contactDetail.model'
import { ContactUpdateTransformer } from '@/modules/contact/models/contact/update/contactUpdate.transformer'
import { contactUpdateFormSchema } from '@/modules/contact/models/contact/update/contactUpdateForm.model'

const props = defineProps<{
  contact: ContactDetail
}>()

const router = useRouter()
const errorToast = useApiErrorToast()
const contactUpdateMutation = useContactUpdateMutation()

const form = useForm({
  initialState: ContactUpdateTransformer.toForm(props.contact),
  schema: contactUpdateFormSchema,
  onSubmit: async (values) => {
    // Execute the mutation
    const result = await contactUpdateMutation.execute({
      body: values,
      params: {
        contactUuid: props.contact.uuid,
      },
    })

    // Handle result using isErr()
    if (result.isErr()) {
      errorToast.show(result.error)
      return
    }

    // Success: navigate back to detail view
    await router.push({
      name: 'contact-detail',
      params: { contactUuid: props.contact.uuid },
    })
  },
})
</script>

<template>
  <FormRoot :form="form">
    <VcTextField
      v-bind="toFormField(form.register('firstName'))"
      label="First Name"
    />
    <VcTextField
      v-bind="toFormField(form.register('lastName'))"
      label="Last Name"
    />
    <FormSubmitButton>Save Changes</FormSubmitButton>
  </FormRoot>
</template>
```

## Result Handling

### Using `match()`

```typescript
const result = await mutation.execute({ body: data })

result.match(
  (successData) => {
    // Success case - type is inferred correctly
    console.log('Created:', successData)
  },
  (error) => {
    // Error case - error is properly typed
    console.error('Failed:', error)
  }
)
```

### Using `isErr()` / `isOk()`

```typescript
const result = await mutation.execute({ body: data })

if (result.isErr()) {
  console.error('Error:', result.error)
  return
}

// TypeScript knows result is Ok here
console.log('Success:', result.value)
```

## Cache Invalidation

Mutations can automatically invalidate queries to keep your data in sync:

### Simple Invalidation

Invalidates all queries with the matching key:

```typescript
queryKeysToInvalidate: {
  contactList: {},
}
```

### Targeted Invalidation

To invalidate a specific query by params, pass the mutation's `TParams` through `execute()` and extract them with a function:

```typescript
// Mutation with params
useMutation<ContactUpdateForm, void, { contactUuid: string }>({
  queryFn: ({ body, params }) => ContactService.update(params.contactUuid, body),
  queryKeysToInvalidate: {
    contactDetail: {
      contactUuid: (params) => params.contactUuid,
    },
  },
})

// Call with body + params
await execute({ body: formData, params: { contactUuid: 'some-id' } })
```

### Multiple Keys

Invalidate multiple query caches at once:

```typescript
queryKeysToInvalidate: {
  contactDetail: {
    contactUuid: (params) => params.contactUuid,
  },
  contactList: {},
  userProfile: {},
}
```

## Type-Safe Query Client

For type-safe query client operations and immediate cache modifications, see the [Type-Safe Query Client](/packages/api-utils/pages/usage/query-client.md) page.