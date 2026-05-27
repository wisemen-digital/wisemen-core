---
name: form
description: >
  Form wrapper that integrates with formango's Form object to provide submit handling,
  unsaved changes detection with route-leave guards, and a context for child components
  like FormSubmitButton. Always pair with a formango useForm() call.
type: component
library: vue-core-design-system
category: infrastructure
exports:
  - UIForm
  - UIFormSubmitButton
  - useInjectFormContext
---

# UIForm

A form wrapper that integrates with formango's `Form` object, providing native form submission, unsaved changes detection with route-leave guards, and a shared context consumed by `UIFormSubmitButton`.

## When to Use

- Wrapping any form that uses formango's `useForm()` for validation and submission
- When you need automatic unsaved changes detection that prompts before route navigation
- When using `UIFormSubmitButton` for keyboard-shortcut-enabled submit buttons

**Use instead:** A plain `<form>` element only when you are not using formango for form state management.

## Import

```ts
import { UIForm, UIFormSubmitButton } from '@wisemen/vue-core-design-system'
```

## Quick Start

```vue
<script setup lang="ts">
import { useForm } from 'formango'
import { z } from 'zod'
import { UIForm, UIFormSubmitButton } from '@wisemen/vue-core-design-system'

const { form } = useForm({
  schema: z.object({
    name: z.string().min(1),
  }),
  onSubmit: async (values) => {
    await saveUser(values)
  },
})
</script>

<template>
  <UIForm :form="form" :prompt-on-unsaved-changes="true">
    <!-- form fields here -->
    <UIFormSubmitButton label="Save" />
  </UIForm>
</template>
```

## Source Files

For full API details, read the component and context files.

- Component: `src/ui/form/Form.vue`
- Submit Button: `src/ui/form/FormSubmitButton.vue`
- Context: `src/ui/form/form.context.ts`

## See Also

- [form-dialog](../form-dialog/SKILL.md) -- Dialog with integrated form handling
