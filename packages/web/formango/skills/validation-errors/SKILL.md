---
name: validation-errors
description: >
  Schema-driven validation in formango: automatic validation on state change,
  displaying errors with formatErrorsToZodFormattedError, server-side errors
  with form.addErrors, isDirty vs isChanged vs isTouched, and Zod custom
  error map for i18n with vue-i18n.
type: core
library: formango
requires:
  - form-setup
---

# Formango — Validation & Error Handling

Formango validates automatically whenever form state changes via a deep watch. No manual validation calls are needed.

## Examples

### Handle server-side validation errors

Use `form.addErrors` to inject errors from your backend after submission. Path is a dot-notation string.

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

// Nested fields use dot notation
form.addErrors([{ path: 'address.street', message: 'Required' }])
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

### Field state: isDirty vs isChanged vs isTouched

```ts
const name = form.register('name', 'initial')

// isDirty: true when current value differs from initial value
// reverts to false if value is set back to initial
name.isDirty.value

// isChanged: true once any change occurs — stays true even if value returns to initial
// only resets on form.reset()
name.isChanged.value

// isTouched: true after the field's onBlur handler fires
name.isTouched.value
```

## See Also

- [form-setup](../form-setup/SKILL.md) — the `toFormField` mapper bridges form setup and error display
- [array-fields](../array-fields/SKILL.md) — array field errors are scoped per-item via path matching
