---
name: form-setup
description: >
  Create a Standard Schema (Zod, Valibot, ArkType), call useForm with
  schema/initialState/onSubmit/onSubmitError, register fields with
  form.register(), build a toFormField mapper for v-bind, compose subforms
  by passing Field<T> to child components where they call field.register()
  for nested paths. Covers Form, Field, UseFormOptions types, submit,
  reset, setValues, blurAll, unregister. Load when building any Vue 3 form
  with formango.
type: core
library: formango
library_version: "3.2.3"
sources:
  - "wisemen-digital/wisemen-core:packages/web/formango/src/lib/useForm.ts"
  - "wisemen-digital/wisemen-core:packages/web/formango/src/types/form.type.ts"
  - "wisemen-digital/wisemen-core:docs/packages/formango/guide/getting-started.md"
  - "wisemen-digital/wisemen-core:docs/packages/formango/api/useForm.md"
  - "wisemen-digital/wisemen-core:docs/packages/formango/api/field.md"
  - "wisemen-digital/wisemen-core:docs/packages/formango/best-practices/custom-input.md"
  - "wisemen-digital/wisemen-core:docs/packages/formango/examples/subforms.md"
---

# Formango — Form Setup & Field Binding

## Setup

```vue
<script setup lang="ts">
import { useForm } from 'formango'
import type { Field } from 'formango'
import { formatErrorsToZodFormattedError } from 'formango'
import type { ZodFormattedError } from 'zod'
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
    // data is typed as { email: string; password: string }
    await api.login(data)
  },
  onSubmitError: ({ data, errors }) => {
    // Called when submit is attempted but validation fails
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
    <CustomInput v-bind="toFormField(email)" />
    <CustomInput v-bind="toFormField(password)" />
    <button type="submit" :disabled="form.isSubmitting.value">
      Submit
    </button>
  </form>
</template>
```

## Core Patterns

### Register fields with default values

```ts
const name = form.register('name', 'Default Name')
// name.modelValue.value is 'Default Name' initially
// Field type: Field<string, string> — no null union because default was provided
```

When a default value is passed, the field's `modelValue` type excludes `null`. Without a default, the type is `TValue | null`.

### Compose subforms with child components

Pass a registered `Field` as a prop to a child component. The child calls `field.register()` for nested paths — this keeps all state in the parent form.

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
  <CustomInput v-bind="toFormField(email)" />
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
  <CustomInput v-bind="toFormField(street)" />
  <CustomInput v-bind="toFormField(city)" />
  <CustomInput v-bind="toFormField(postalCode)" />
</template>
```

### Conditional validation with Zod refine

```ts
const deleteSchema = z.object({
  confirmName: z.string().refine(
    (val) => val === expectedName.toUpperCase(),
    { message: i18n.t('validation.name_mismatch') },
  ),
})

const form = useForm({
  schema: deleteSchema,
  onSubmit: async () => {
    await deleteMutation.execute()
  },
})

const confirmName = form.register('confirmName')
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

## Common Mistakes

### CRITICAL Destructuring form from useForm (v2 pattern)

Wrong:

```ts
const { form } = useForm({ schema, onSubmit })
```

Correct:

```ts
const form = useForm({ schema, onSubmit })
```

In v3, `useForm` returns the `Form` object directly. Destructuring `{ form }` produces `undefined` because there is no `form` property on the return value. This was changed in the v2 → v3 migration.

Source: CHANGELOG.md v3.0.0

### CRITICAL Using onSubmitForm instead of onSubmit

Wrong:

```ts
const form = useForm({
  schema,
  onSubmitForm: (data) => { /* never called */ },
})
```

Correct:

```ts
const form = useForm({
  schema,
  onSubmit: (data) => { /* called on valid submit */ },
})
```

v3 renamed `onSubmitForm` to `onSubmit` and `onSubmitFormError` to `onSubmitError`. The old callback names are silently ignored — the form submits but the handler never fires.

Source: CHANGELOG.md v3.0.0

### CRITICAL Not passing Field to subform component

Wrong:

```vue
<!-- AddressForm.vue — creates a separate form, breaks parent state -->
<script setup lang="ts">
import { useForm } from 'formango'
import { addressSchema } from './address.model'

const form = useForm({
  schema: addressSchema,
  onSubmit: (data) => { /* disconnected from parent */ },
})
const street = form.register('street')
</script>
```

Correct:

```vue
<!-- AddressForm.vue — registers on parent form via Field prop -->
<script setup lang="ts">
import type { Field } from 'formango'
import type { Address } from './address.model'

const { address } = defineProps<{ address: Field<Address> }>()
const street = address.register('street')
</script>
```

Subform components must accept a `Field<T>` prop and call `field.register()` for nested paths. Creating a separate `useForm` in the child disconnects it from the parent form's validation, dirty tracking, and submission.

Source: docs/packages/formango/examples/subforms.md

### HIGH Accessing field values without .value

Wrong:

```ts
if (name.isDirty) {
  // always truthy — isDirty is a ComputedRef object, not a boolean
}
```

Correct:

```ts
if (name.isDirty.value) {
  // correct boolean check
}
```

Field properties (`modelValue`, `errors`, `isDirty`, `isTouched`, `isValid`, `isChanged`) are `ComputedRef` or `Ref` — they require `.value` in `<script>`. Vue auto-unwraps refs in `<template>`, so this only matters in script code.

Source: src/types/form.type.ts — Field interface

### HIGH Using initialData instead of initialState

Wrong:

```ts
const form = useForm({
  schema,
  initialData: { name: 'test' },
  onSubmit,
})
// form starts empty — initialData is silently ignored
```

Correct:

```ts
const form = useForm({
  schema,
  initialState: { name: 'test' },
  onSubmit,
})
```

The option is named `initialState`, not `initialData`. Passing `initialData` is silently ignored because TypeScript's excess property check may not catch it depending on the call site.

Source: src/lib/useForm.ts — UseFormOptions interface

See also: [array-fields](../array-fields/SKILL.md) — for dynamic lists, use `registerArray` instead of `register`

See also: [validation-errors](../validation-errors/SKILL.md) — error display, i18n, server-side errors

## Version

Targets formango v3.2.1.
