---
name: dialog
description: >
  Modal dialog system with header, body, footer, and close button sub-components.
  Built on Reka UI DialogRoot with animated overlay, scroll-aware separators, and
  a chin feature for contextual actions. Supports both template-driven (v-model) and
  imperative (useOverlay) patterns.
type: component
library: vue-core-design-system
category: overlay
requires:
  - overlay-system
exports:
  - UIDialog
  - UIDialogBody
  - UIDialogContainer
  - UIDialogFooter
  - UIDialogFooterCancel
  - UIDialogFooterPrimary
  - UIDialogFooterSecondary
  - UIDialogFooterSubmit
  - UIDialogHeader
  - useOverlay
  - useDialogTriggerProps
---

# UIDialog

A modal dialog with overlay backdrop, animated transitions, and a composable sub-component structure for header, scrollable body, and footer actions.

## When to Use

- Presenting forms, confirmations, or detailed content that requires user attention
- Blocking interaction with the page behind until the user completes or dismisses an action
- Building multi-step workflows in a focused overlay

**Use instead:** `UIConfirmDialog` for simple yes/no confirmations, `UIFormDialog` for dialogs with integrated form handling, `UIPopover` for non-blocking floating content.

## Import

```ts
import {
  UIDialog, UIDialogBody, UIDialogContainer, UIDialogFooter,
  UIDialogFooterCancel, UIDialogFooterPrimary, UIDialogFooterSecondary,
  UIDialogFooterSubmit, UIDialogHeader, useOverlay, useDialogTriggerProps,
} from '@wisemen/vue-core-design-system'
```

## Quick Start

```vue
<script setup lang="ts">
import {
  UIDialog, UIDialogHeader, UIDialogBody, UIDialogFooter,
  UIDialogFooterCancel, UIDialogFooterPrimary,
} from '@wisemen/vue-core-design-system'

const emit = defineEmits<{ close: [] }>()
</script>

<template>
  <UIDialog size="md" @close="emit('close')">
    <UIDialogHeader title="Dialog Title" description="A brief description." />
    <UIDialogBody>
      <p class="text-sm text-secondary">Dialog content goes here.</p>
    </UIDialogBody>
    <UIDialogFooter>
      <template #right>
        <UIDialogFooterCancel label="Cancel" @click="emit('close')" />
        <UIDialogFooterPrimary label="Confirm" @click="emit('close')" />
      </template>
    </UIDialogFooter>
  </UIDialog>
</template>
```

## Source Files

For full API details, read the props files. For usage examples, read the playground files.

- Props: `src/ui/dialog/dialog.props.ts`, `src/ui/dialog/dialogHeader.props.ts`, `src/ui/dialog/dialogFooterButton.props.ts`
- Components: `src/ui/dialog/Dialog.vue`, `src/ui/dialog/DialogHeader.vue`, `src/ui/dialog/DialogBody.vue`, `src/ui/dialog/DialogFooter.vue`, `src/ui/dialog/DialogContainer.vue`
- Composables: `src/ui/dialog/dialogOverlay.composable.ts`, `src/ui/dialog/dialogTriggerProps.composable.ts`, `src/ui/dialog/dialogChin.composable.ts`
- Playground: `src/ui/dialog/stories/`

## See Also

- [confirm-dialog](../confirm-dialog/SKILL.md) -- Pre-built confirmation dialog
- [form-dialog](../form-dialog/SKILL.md) -- Dialog with form integration
- [popover](../popover/SKILL.md) -- Non-blocking floating content
