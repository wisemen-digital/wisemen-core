# Type-Safe Query Client

Type-safe query client utilities allow you to immediately update the cache with expected results before the server responds. This provides instant UI feedback while the request is in flight.

## Overview

The `useQueryClient()` composable provides three core methods:
- **`update()`** - Update cached data based on a predicate
- **`get()`** - Read cached data
- **`set()`** - Write data to cache
- **`invalidate()`** - Trigger a refetch

All methods are **fully type-safe** and work with your query keys configuration.

## Basic Usage

### Single Entity Update

Update a specific query's cached data:

```typescript
// src/composables/useUpdateContact.ts

import { useMutation } from '@/api'
import { ContactService } from '@/services'
import { useQueryClient } from '@/api'

export function useUpdateContact(contactUuid: string, originalData: ContactDetail) {
  const { execute } = useMutation({
    queryFn: async (body: ContactUpdateForm) => {
      return await ContactService.update(contactUuid, body)
    },
  })

  const queryClient = useQueryClient()

  async function update(body: Partial<ContactDetail>) {
    // Optimistically update the cache
    queryClient.update(
      ['contactDetail', { contactUuid }],
      {
        by: (contact) => contact.uuid === contactUuid,
        value: (contact) => ({ ...contact, ...body }),
      }
    )

    // Execute mutation
    const result = await execute(body)

    // Handle errors - rollback by restoring original data
    if (result.isErr()) {
      queryClient.set(['contactDetail', { contactUuid }], originalData)
    }
  }

  return { update }
}
```

### List Entity Update

Update items in a cached list:

```typescript
// Update all products with "electronics" category
queryClient.update('productList', {
  by: (product) => product.category === 'electronics',
  value: (product) => ({ ...product, inStock: false }),
})
```

### Get Cached Data

Read data from the cache:

```typescript
// Get specific cached query
const contact = queryClient.get(
  ['contactDetail', { contactUuid: '123' }]
)

// Get all queries with this key
const allContacts = queryClient.get('contactDetail')

// Get exact query only
const contact = queryClient.get('contactDetail', { isExact: true })
```

### Set Cached Data

Manually set cache data:

```typescript
queryClient.set(
  ['contactDetail', { contactUuid: '123' }],
  contactData
)
```

## Real-World Example: Edit Form with Optimistic Updates

```typescript
// src/composables/useEditContact.ts

import { ref, computed } from 'vue'
import { useQuery, useMutation, useQueryClient } from '@/api'
import { ContactService } from '@/services'
import type { ContactUuid, ContactDetail, ContactUpdateForm } from '@/types'

export function useEditContact(contactUuid: string) {
  const { result: contactResult, refetch } = useQuery('contactDetail', {
    params: { contactUuid: computed(() => contactUuid) },
    queryFn: () => ContactService.getByUuid(contactUuid),
    staleTime: 1000 * 60 * 5,
  })

  const updateMutation = useMutation({
    queryFn: async (body: ContactUpdateForm) => {
      return await ContactService.update(contactUuid, body)
    },
  })

  const queryClient = useQueryClient()

  async function handleSave(updates: Partial<ContactDetail>) {
    // Store original for rollback
    const originalData = contactResult.value.getValue()

    // Optimistically update the cache
    queryClient.update(
      ['contactDetail', { contactUuid }],
      {
        by: (contact) => contact.uuid === contactUuid,
        value: (contact) => ({ ...contact, ...updates }),
      }
    )

    // Execute the mutation
    const result = await updateMutation.execute(updates)

    if (result.isErr()) {
      // Rollback on error - restore original data
      queryClient.set(
        ['contactDetail', { contactUuid }],
        originalData
      )
      
      console.error('Update failed:', result.getError().message)
      return false
    }

    return true
  }

  return {
    contact: contactResult,
    isLoading: updateMutation.isLoading,
    handleSave,
  }
}
```

Component usage:

```vue
<script setup lang="ts">
import { ref } from 'vue'
import { useEditContact } from '@/composables'

const props = defineProps<{ contactUuid: string }>()
const { contact, handleSave } = useEditContact(props.contactUuid)

const formData = ref({
  name: '',
  email: '',
})

async function onSubmit() {
  const success = await handleSave(formData.value)
  if (success) {
    formData.value = { name: '', email: '' }
  }
}
</script>

<template>
  <div v-if="contact.isOk()" class="contact-editor">
    <h1>{{ contact.getValue().name }}</h1>
    
    <form @submit.prevent="onSubmit">
      <input
        v-model="formData.name"
        :placeholder="contact.getValue().name"
      />
      <input
        v-model="formData.email"
        :placeholder="contact.getValue().email"
      />
      <button type="submit">Save Changes</button>
    </form>
  </div>
</template>
```

## Update Patterns

### Pattern 1: Update by ID

Most common pattern for single entity updates:

```typescript
queryClient.update(
  ['userDetail', { userId: '123' }],
  {
    by: (user) => user.id === '123',
    value: (user) => ({ ...user, name: 'Updated Name' }),
  }
)
```

### Pattern 2: Update Multiple with Predicate

Update multiple items in a list matching a condition:

```typescript
queryClient.update('orderList', {
  by: (order) => order.status === 'pending',
  value: (order) => ({ ...order, status: 'confirmed' }),
})
```

### Pattern 3: Update All Queries of a Type

Update all cached queries with a key without specifying params:

```typescript
// Updates ALL userDetail queries
queryClient.update('userDetail', {
  by: (user) => user.isActive === false,
  value: (user) => ({ ...user, isActive: true }),
})
```

## Working with Infinite Queries

Optimistic updates work seamlessly with infinite queries:

```typescript
// src/composables/useToggleProductFavorite.ts

import { useMutation, useQueryClient } from '@/api'
import { ProductService } from '@/services'

export function useToggleProductFavorite() {
  const queryClient = useQueryClient()

  const toggleMutation = useMutation({
    queryFn: async (productId: string) => {
      return await ProductService.toggleFavorite(productId)
    },
  })

  async function toggle(productId: string) {
    // Backup original state from both caches
    const originalFromList = queryClient.get('productList')
    const originalFromKeyset = queryClient.get('productListKeyset')

    // Optimistically update in all product lists
    queryClient.update('productList', {
      by: (product) => product.id === productId,
      value: (product) => ({ 
        ...product, 
        isFavorite: !product.isFavorite 
      }),
    })

    // Also update keyset infinite query
    queryClient.update('productListKeyset', {
      by: (product) => product.id === productId,
      value: (product) => ({ 
        ...product, 
        isFavorite: !product.isFavorite 
      }),
    })

    // Execute mutation
    const result = await toggleMutation.execute(productId)

    if (result.isErr()) {
      // Rollback both by restoring original data
      queryClient.set('productList', originalFromList)
      queryClient.set('productListKeyset', originalFromKeyset)
    }
  }

  return { toggle }
}
```

## Error Handling and Rollback

Always plan for failures:

```typescript
async function updateAndHandle(updates: any) {
  // Backup original
  const original = queryClient.get(['contactDetail', { contactUuid }])

  // Optimistic update
  queryClient.update(['contactDetail', { contactUuid }], {
    by: (item) => item.uuid === contactUuid,
    value: (item) => ({ ...item, ...updates }),
  })

  // Execute mutation
  const result = await mutation.execute(updates)

  if (result.isErr()) {
    // Rollback: restore original data
    queryClient.set(['contactDetail', { contactUuid }], original)

    // Show error to user
    showErrorNotification(result.getError().message)
    return
  }

  // Success - the cache is already updated
}
```

## Best Practices

1. **Always backup original data** - Store the data before optimistic update
2. **Rollback on error** - Restore original data if mutation fails
3. **Use for fast operations** - Best for quick updates (likes, toggles, simple edits)
4. **Validate before updating** - Check data validity before optimistic update
5. **Handle network errors** - Network timeouts and failures should trigger rollback
6. **Keep predicates simple** - Use straightforward conditions in `by` function
7. **Consider consistency** - Update both detail and list queries if affected

## Predicate Function Tips

The `by` function receives the item and should return true if it matches:

```typescript
// By ID
by: (item) => item.id === targetId

// By UUID
by: (item) => item.uuid === targetUuid

// By multiple conditions
by: (item) => item.userId === userId && item.status === 'pending'

// By existence of property
by: (item) => item.name === 'John Doe'

// By partial match
by: (item) => item.email.includes('@company.com')
```

## When to Use Optimistic Updates

✅ **Good use cases:**
- Toggling favorites/bookmarks
- Updating user profile fields
- Changing item quantity in cart
- Updating task status
- Simple form field updates

❌ **Avoid for:**
- Operations that might fail often
- Updates that need server validation
- Complex multi-step operations
- Bulk updates of many items
- Operations with side effects

## Advanced: Multi-Step Updates

Update both detail and list caches:

```typescript
async function updateAndRefreshLists(contactUuid: string, updates: any) {
  // Update the detail query
  queryClient.update(['contactDetail', { contactUuid }], {
    by: (contact) => contact.uuid === contactUuid,
    value: (contact) => ({ ...contact, ...updates }),
  })

  // Update all list queries
  queryClient.update('contactList', {
    by: (contact) => contact.uuid === contactUuid,
    value: (contact) => ({ ...contact, ...updates }),
  })

  const result = await mutation.execute(updates)

  if (result.isErr()) {
    // Rollback both
    await queryClient.invalidate(['contactDetail', { contactUuid }])
    await queryClient.invalidate('contactList')
  }
}
```
