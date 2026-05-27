---
name: form-setup
description: >
  Create a Standard Schema (Zod, Valibot, ArkType), call useForm with
  schema/initialState/onSubmit/onSubmitError, register fields with
  form.register(), build a toFormField mapper for v-bind, compose subforms
  by passing Field<T> to child components where they call field.register()
  for nested paths.
type: core
library: formango
---

# Formango — Form Setup & Field Binding

## Quick Start

```vue
<script setup lang="ts">
import { useForm } from 'formango'
import type { Field } from 'formango'
import { formatErrorsToZodFormattedError } from 'formango'
import { UITextField } from '@wisemen/vue-core-design-system'
import { z } from 'zod'

const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8),
})

const form = useForm({
  schema: loginSchema,
  initialState: {
    email: '',
    password: '',
  },
  onSubmit: async (data) => {
    await api.login(data)
  },
  onSubmitError: ({ data, errors }) => {
    console.error('Validation failed:', errors)
  },
})

const email = form.register('email')
const password = form.register('password')

function toFormField<TValue, TDefaultValue>(field: Field<TValue, TDefaultValue>) {
  return {
    'isTouched': field.isTouched.value,
    'errors': formatErrorsToZodFormattedError(field.errors.value),
    'modelValue': field.modelValue.value,
    'onBlur': field.onBlur,
    'onUpdate:modelValue': field['onUpdate:modelValue'],
  }
}
</script>

<template>
  <form @submit.prevent="form.submit">
    <UITextField v-bind="toFormField(email)" label="Email" placeholder="Enter your email..." />
    <UITextField v-bind="toFormField(password)" label="Password" type="password" placeholder="Enter your password..." />
    <button type="submit" :disabled="form.isSubmitting.value">
      Submit
    </button>
  </form>
</template>
```

## Examples

### Register fields with default values

```ts
const name = form.register('name', 'Default Name')
// Field type: Field<string, string> — no null union because default was provided
```

When a default value is passed, the field's `modelValue` type excludes `null`. Without a default, the type is `TValue | null`.

### Compose with child components

For splitting top-level fields across components, pass the `Form` itself typed as `Form<typeof schema>`. For nested object fields, pass a registered `Field<T>` — the child calls `field.register()` for nested paths.

```vue
<!-- UserForm.vue -->
<script setup lang="ts">
import { useForm } from 'formango'
import { z } from 'zod'
import AddressForm from './AddressForm.vue'

const userSchema = z.object({
  email: z.string().email(),
  shippingAddress: z.object({
    street: z.string(),
    city: z.string(),
    postalCode: z.string(),
  }),
})

const form = useForm({
  schema: userSchema,
  onSubmit: (data) => { /* typed as full user object */ },
})

const email = form.register('email')
const shippingAddress = form.register('shippingAddress')
</script>

<template>
  <UITextField v-bind="toFormField(email)" label="Email" />
  <AddressForm :address="shippingAddress" />
</template>
```

```vue
<!-- AddressForm.vue -->
<script setup lang="ts">
import type { Field } from 'formango'

interface Address {
  street: string
  city: string
  postalCode: string
}

const { address } = defineProps<{ address: Field<Address> }>()

const street = address.register('street')
const city = address.register('city')
const postalCode = address.register('postalCode')
</script>

<template>
  <UITextField v-bind="toFormField(street)" label="Street" />
  <UITextField v-bind="toFormField(city)" label="City" />
  <UITextField v-bind="toFormField(postalCode)" label="Postal Code" />
</template>
```

### Form state and lifecycle

```ts
form.state.value        // current form state (DeepPartial<SchemaType>)
form.isDirty.value      // true if any field differs from initial state
form.isSubmitting.value // true during async onSubmit execution
form.isValid.value      // true if no validation errors
form.hasAttemptedToSubmit.value // true after first submit() call

form.setValues({ email: 'new@test.com' }) // set values programmatically
form.blurAll()                             // mark all fields as touched
form.reset()                               // reset to initialState
form.unregister('email')                   // unregister a field
```

## See Also

- [array-fields](../array-fields/SKILL.md) — for dynamic lists, use `registerArray` instead of `register`
- [validation-errors](../validation-errors/SKILL.md) — error display, i18n, server-side errors
