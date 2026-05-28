---
name: form-dialog
description: >
  A dialog with integrated formango form handling. Wraps UIDialog with form context,
  automatic form ID generation, and optional unsaved-changes prompt.
type: component
library: vue-core-design-system
category: overlay
requires:
  - overlay-system
exports:
  - UIFormDialog
  - UIFormDialogForm
---

# UIFormDialog

A dialog that integrates with formango for form state management, validation, and optional unsaved-changes prompting.

## When to Use

- Building a dialog that contains a validated form (create, edit, settings)
- When you need automatic form ID association between the dialog and a submit button
- When you want to prompt users about unsaved changes when they try to close the dialog

**Use instead:** `UIDialog` when you do not need form integration, `UIConfirmDialog` for simple yes/no confirmations.

## Import

```ts
import { UIFormDialog, UIFormDialogForm } from '@wisemen/vue-core-design-system'
```

## Quick Start

```vue
<script setup lang="ts">
import { useForm } from 'formango'
import { z } from 'zod'
import {
  UIFormDialog, UIFormDialogForm,
  UIDialogHeader, UIDialogBody, UIDialogFooter,
  UIDialogFooterCancel, UIDialogFooterSubmit,
} from '@wisemen/vue-core-design-system'

const emit = defineEmits<{ close: [] }>()

const form = useForm({
  schema: z.object({ name: z.string().min(1) }),
  initialState: { name: '' },
  onSubmit: async (values) => {
    await saveItem(values)
    emit('close')
  },
})
</script>

<template>
  <UIFormDialog size="md" @close="emit('close')">
    <UIDialogHeader title="Create Item" />
    <UIFormDialogForm :form="form">
      <UIDialogBody>
        <!-- form fields here -->
      </UIDialogBody>
      <UIDialogFooter>
        <template #right>
          <UIDialogFooterCancel label="Cancel" />
          <UIDialogFooterSubmit label="Create" />
        </template>
      </UIDialogFooter>
    </UIFormDialogForm>
  </UIFormDialog>
</template>
```

## Source Files

For full API details, read the component and props files.

- Props: `src/ui/dialog/formDialog.props.ts`
- Components: `src/ui/dialog/FormDialog.vue`, `src/ui/dialog/FormDialogForm.vue`

## See Also

- [dialog](../dialog/SKILL.md) -- For custom dialog layouts without form integration
- [confirm-dialog](../confirm-dialog/SKILL.md) -- For simple yes/no confirmations
- [form](../form/SKILL.md) -- Standalone form wrapper with formango integration
