# Mutations (Create, Update, Delete)

This example demonstrates how to use `useMutation` from `@wisemen/vue-core-api-utils` to handle data mutations like creating, updating, and deleting resources.

## Create Mutation

```typescript
// src/composables/useCreateContact.ts

import { useMutation } from '@/api'
import { ContactService } from '@/services'

export function useCreateContact() {
  return useMutation({
    queryFn: async (body: ContactCreateForm) => {
      return await ContactService.create(body)
    },
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

const { execute, isLoading, result } = useCreateContact()

async function handleSubmit(form: ContactCreateForm) {
  await execute(form)
  
  if (result.value.isOk()) {
    const contactId = result.value.getValue()
    console.log('Contact created with ID:', contactId)
    // Redirect or show success message
  }
}
</script>

<template>
  <form @submit.prevent="handleSubmit">
    <input v-model="form.name" placeholder="Contact name" />
    <button :disabled="isLoading">
      {{ isLoading ? 'Creating...' : 'Create' }}
    </button>
    <div v-if="result.isErr()" class="error">
      {{ result.getError().message }}
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
    queryFn: (body: ContactUpdateForm) => {
      return ContactService.update(contactId, body)
    },
    queryKeysToInvalidate: {
      contactDetail: { contactId },
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
const { execute, isLoading } = useUpdateContact(props.contactId)

async function handleSubmit(form: ContactUpdateForm) {
  const result = await execute(form)
  
  result.value.match(
    (data) => {
      console.log('Contact updated:', data)
      // Show success message
    },
    (error) => {
      console.error('Update failed:', error.message)
    }
  )
}
</script>

<template>
  <form @submit.prevent="handleSubmit">
    <input v-model="form.name" />
    <button :disabled="isLoading">Save</button>
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
    queryFn: async (contactId: string) => {
      return await ContactService.delete(contactId)
    },
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
const { execute, isLoading, result } = useDeleteContact()

async function handleDelete() {
  if (!confirm('Are you sure?')) return
  
  await execute(props.contactId)
  
  if (result.value.isOk()) {
    // Navigate away or show success
  }
}
</script>

<template>
  <button @click="handleDelete" :disabled="isLoading">
    {{ isLoading ? 'Deleting...' : 'Delete' }}
  </button>
</template>
```

## Return Values

- **`result`**: ComputedRef to an AsyncResult containing the response or error
- **`execute`**: Function to trigger the mutation
- **`isLoading`**: Whether the mutation is in progress
- **`data`** (deprecated): Use `result.value.getValue()` instead
- **`error`** (deprecated): Use `result.value.getError()` instead

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
      errorToast.show(result.getError())
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
  console.error('Error:', result.getError())
  return
}

// TypeScript knows result is Ok here
console.log('Success:', result.getValue())
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

Invalidates specific queries based on parameters:

```typescript
queryKeysToInvalidate: {
  contactDetail: {
    contactUuid: 'some-id',
  },
}
```

### Multiple Keys

Invalidate multiple query caches at once:

```typescript
queryKeysToInvalidate: {
  contactDetail: {
    contactUuid: 'some-id',
  },
  contactList: {},
  userProfile: {},
}
```

## Type-Safe Query Client

For type-safe query client operations and immediate cache modifications, see the [Type-Safe Query Client](/packages/api-utils/pages/usage/query-client.md) page.