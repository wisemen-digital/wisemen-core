---
name: confirm-dialog
description: >
  A pre-built confirmation dialog with title, description, icon, cancel button, and
  confirm button. Supports destructive styling and async confirm callbacks with automatic
  loading state. Uses the dialog sub-components internally.
type: component
library: vue-core-design-system
category: overlay
requires:
  - overlay-system
exports:
  - UIConfirmDialog
---

# UIConfirmDialog

A pre-built confirmation dialog that combines UIDialog, UIDialogHeader, UIDialogFooter, and UIDialogFooterCancel into a single component with a standardized confirm/cancel flow.

## When to Use

- Confirming destructive actions (delete, remove, discard)
- Asking the user for a simple yes/no decision
- Showing a warning before an irreversible operation

**Use instead:** `UIDialog` for custom dialog layouts with forms or complex content, `UIFormDialog` for dialogs with form validation.

## Import

```ts
import { UIConfirmDialog } from '@wisemen/vue-core-design-system'
```

## Quick Start

```vue
<script setup lang="ts">
import { UIConfirmDialog } from '@wisemen/vue-core-design-system'
import { Trash01Icon } from '@wisemen/vue-core-icons'

const emit = defineEmits<{
  close: []
}>()

async function handleConfirm() {
  await deleteItem()
  emit('close')
}
</script>

<template>
  <UIConfirmDialog
    :is-destructive="true"
    :icon="Trash01Icon"
    title="Delete item"
    description="Are you sure you want to delete this item? This action cannot be undone."
    confirm-label="Delete"
    cancel-label="Cancel"
    :on-confirm="handleConfirm"
    @close="emit('close')"
  />
</template>
```

## Source Files

For full API details, read the props file.

- Props: `src/ui/dialog/confirmDialog.props.ts`
- Component: `src/ui/dialog/ConfirmDialog.vue`

## See Also

- [dialog](../dialog/SKILL.md) -- For custom dialog layouts
- [form-dialog](../form-dialog/SKILL.md) -- For dialogs with form validation
