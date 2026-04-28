---
name: validation-errors
description: >
  Schema-driven validation in formango: automatic validation on state change,
  displaying errors with formatErrorsToZodFormattedError, Field.errors,
  Field.rawErrors, Form.addErrors for server-side errors, isDirty vs
  isChanged vs isTouched, Form.isValid, Form.hasAttemptedToSubmit,
  Form.blurAll, Form.reset, onSubmitError callback, Zod refine/superRefine
  for cross-field validation, Zod custom error map for i18n with vue-i18n.
  Load when handling form errors, server validation, or i18n error messages.
type: core
library: formango
library_version: "3.2.1"
requires:
  - form-setup
sources:
  - "wisemen-digital/wisemen-core:packages/web/formango/src/lib/useForm.ts"
  - "wisemen-digital/wisemen-core:packages/web/formango/src/lib/formatErrors.ts"
  - "wisemen-digital/wisemen-core:packages/web/formango/src/types/form.type.ts"
  - "wisemen-digital/wisemen-core:docs/packages/formango/api/useForm.md"
  - "wisemen-digital/wisemen-core:docs/packages/formango/best-practices/i18n.md"
  - "wisemen-digital/wisemen-core:docs/packages/formango/examples/external-errors.md"
---

This skill builds on [form-setup](../form-setup/SKILL.md). Read it first for `useForm`, `register`, and `Field` concepts.

# Formango — Validation & Error Handling

## Setup

Formango validates automatically whenever form state changes via a deep watch on `form.value`. No manual validation calls are needed.

```ts
import { useForm } from 'formango'
import { formatErrorsToZodFormattedError } from 'formango'
import type { Field } from 'formango'
import type { ZodFormattedError } from 'zod'
import { z } from 'zod'

const schema = z.object({
  email: z.string().email(),
  password: z.string().min(8),
})

const form = useForm({
  schema,
  onSubmit: async (data) => {
    // Only called when form is valid
    const response = await api.login(data)
  },
  onSubmitError: ({ data, errors }) => {
    // Called when submit is attempted but validation fails
    // errors is FormattedError<SchemaType>[]
  },
})

const email = form.register('email')
const password = form.register('password')

// Map field to component props with formatted errors
function toFormField<TValue, TDefaultValue>(field: Field<TValue, TDefaultValue>) {
  return {
    'isTouched': field.isTouched.value,
    'errors': formatErrorsToZodFormattedError(field.errors.value),
    'modelValue': field.modelValue.value,
    'onBlur': field.onBlur,
    'onUpdate:modelValue': field['onUpdate:modelValue'],
  }
}
```

## Core Patterns

### Handle server-side validation errors

Use `form.addErrors` to inject errors from your backend after submission.

```ts
const form = useForm({
  schema: loginSchema,
  onSubmit: async (data) => {
    const response = await fetch('/api/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    })

    if (!response.ok) {
      const error = await response.json()
      form.addErrors([{
        path: 'password',
        message: 'Your password or email address is wrong',
      }])
      return
    }
  },
})
```

### Set up i18n with Zod custom error map

Create a Zod error map that translates validation messages using vue-i18n.

```ts
// zod.config.ts
import { z } from 'zod'
import i18n from '@/plugins/i18n'

const customErrorMap: z.ZodErrorMap = (issue, ctx) => {
  const t = i18n.global.t

  if (issue.code === z.ZodIssueCode.invalid_type)
    return { message: t('errors.invalid_type') }
  if (issue.code === z.ZodIssueCode.invalid_string) {
    if (issue.validation === 'email')
      return { message: t('errors.invalid_email') }
    return { message: t('errors.invalid_string') }
  }
  if (issue.code === z.ZodIssueCode.too_small) {
    if (issue.type === 'string')
      return { message: t('errors.too_small_string', { count: issue.minimum }) }
    return { message: t('errors.too_small', { count: issue.minimum }) }
  }
  if (issue.code === z.ZodIssueCode.too_big) {
    if (issue.type === 'string')
      return { message: t('errors.too_big_string', { count: issue.maximum }) }
    return { message: t('errors.too_big', { count: issue.maximum }) }
  }

  return { message: ctx.defaultError }
}

z.setErrorMap(customErrorMap)
```

Import this file in your app entry point:

```ts
// main.ts
import './configs/zod.config'
```

### Show errors conditionally (after touch or submit attempt)

```vue
<script setup lang="ts">
const errorVisible = computed(() => {
  return field.isTouched.value || form.hasAttemptedToSubmit.value
})
</script>

<template>
  <input
    :value="field.modelValue.value"
    @input="field['onUpdate:modelValue']($event.target.value)"
    @blur="field.onBlur()"
  >
  <p v-if="errorVisible && field.errors.value.length > 0">
    {{ field.errors.value[0].message }}
  </p>
</template>
```

### Field state: isDirty vs isChanged vs isTouched

```ts
const name = form.register('name', 'initial')

// isDirty: ComputedRef<boolean>
// true when current value differs from initial value
// reverts to false if value is set back to initial
name.isDirty.value

// isChanged: Ref<boolean>
// true once any change occurs — stays true even if value returns to initial
// only resets on form.reset()
name.isChanged.value

// isTouched: ComputedRef<boolean>
// true after the field's onBlur handler fires
name.isTouched.value
```

## Common Mistakes

### HIGH Passing raw errors to ZodFormattedError consumers

Wrong:

```ts
function toFormField<TValue, TDefaultValue>(field: Field<TValue, TDefaultValue>) {
  return {
    errors: field.errors.value, // FormattedError[] — wrong shape for ZodFormattedError
    modelValue: field.modelValue.value,
    onBlur: field.onBlur,
  }
}
```

Correct:

```ts
function toFormField<TValue, TDefaultValue>(field: Field<TValue, TDefaultValue>) {
  return {
    errors: formatErrorsToZodFormattedError(field.errors.value),
    modelValue: field.modelValue.value,
    onBlur: field.onBlur,
  }
}
```

`Field.errors` returns `FormattedError[]` (array of `{ message, path }`), not `ZodFormattedError`. Components expecting the Zod shape with `_errors` arrays need the conversion via `formatErrorsToZodFormattedError`.

Source: docs/packages/formango/api/field.md — toFormField example

### MEDIUM Confusing isDirty and isChanged

Wrong:

```ts
// Using isChanged to guard navigation — stays true even after undo
if (field.isChanged.value) {
  showUnsavedChangesWarning()
}
```

Correct:

```ts
// Use isDirty — reflects actual difference from initial value
if (field.isDirty.value) {
  showUnsavedChangesWarning()
}
```

`isDirty` compares current value to initial value and reverts to `false` when they match again. `isChanged` is a sticky flag — once set to `true`, it stays `true` until `form.reset()`. Use `isDirty` for unsaved-changes guards and `isChanged` for tracking whether a field was ever modified.

Source: src/types/form.type.ts — Field interface JSDoc

### HIGH Calling addErrors with wrong path format

Wrong:

```ts
// Passing path as array (Zod style) — silently fails to match any field
form.addErrors([{ path: ['email'], message: 'Invalid email' }])
```

Correct:

```ts
// Path is a dot-notation string
form.addErrors([{ path: 'email', message: 'Invalid email' }])

// Nested fields use dot notation
form.addErrors([{ path: 'address.street', message: 'Required' }])
```

`addErrors` expects `FormattedError[]` where `path` is a dot-notation string. Passing an array (like Zod's internal format) silently fails to associate the error with any registered field.

Source: docs/packages/formango/examples/external-errors.md

### HIGH Tension: Standard Schema generality vs. Zod-specific features

`formatErrorsToZodFormattedError` and Zod custom error maps are Zod-specific. When using Valibot or ArkType as the schema library, `formatErrorsToZodFormattedError` still works (it accepts `FormattedError[]` and `StandardSchemaV1.Issue[]`), but Zod error maps and `ZodFormattedError` types are not applicable. Build error display around `field.errors.value` (which is schema-agnostic) instead of Zod-specific types when using non-Zod schemas.

See also: [form-setup](../form-setup/SKILL.md) — the `toFormField` mapper bridges form setup and error display

See also: [array-fields](../array-fields/SKILL.md) — array field errors are scoped per-item via path matching

## Version

Targets formango v3.2.1.
