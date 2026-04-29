---
name: dialog-toast-usage
description: >
  VcDialog compound component (VcDialogRoot, VcDialogPortal,
  VcDialogOverlay, VcDialogContent, VcDialogTitle, VcDialogDescription,
  VcDialogCloseButton) with useDialog composable for typed imperative
  control, VcToastContainer with useToast composable
  (success/error/info with title, description, durationMs).
  Use when building modal dialogs or showing toast notifications.
type: core
library: vue-core-components
library_version: "3.0.1"
requires:
  - config-setup
sources:
  - "wisemen-digital/wisemen-core:packages/web/components-next/src/components/dialog/index.ts"
  - "wisemen-digital/wisemen-core:packages/web/components-next/src/components/toast/index.ts"
---

# @wisemen/vue-core-components — Dialog & Toast Usage

## Setup

Add `VcToastContainer` at your app root (inside VcConfigProvider) — this is where toast notifications render:

```vue
<!-- App.vue -->
<script setup lang="ts">
import { VcConfigProvider, VcToastContainer } from '@wisemen/vue-core-components'
</script>

<template>
  <VcConfigProvider
    locale="en-US"
    toast-position="bottom-right"
    :auto-close-toast="{ success: 3000, error: false, info: 5000 }"
  >
    <RouterView />
    <VcToastContainer />
  </VcConfigProvider>
</template>
```

Toast position and auto-close behaviour are configured via VcConfigProvider. `error: false` means error toasts stay until manually dismissed.

## Core Patterns

### Simple dialog with v-model

```vue
<script setup lang="ts">
import {
  VcDialog,
  VcDialogTitle,
  VcDialogDescription,
  VcDialogCloseButton,
  VcButton,
} from '@wisemen/vue-core-components'
import { ref } from 'vue'

const isOpen = ref(false)

async function handleConfirm() {
  await deleteItem()
  isOpen.value = false
}
</script>

<template>
  <VcButton @click="isOpen = true">Delete</VcButton>

  <VcDialog v-model:is-open="isOpen" prevent-click-outside>
    <VcDialogTitle>Delete this item?</VcDialogTitle>
    <VcDialogDescription>This action cannot be undone.</VcDialogDescription>
    <div class="flex gap-md">
      <VcButton variant="secondary" @click="isOpen = false">Cancel</VcButton>
      <VcButton variant="primary" @click="handleConfirm">Delete</VcButton>
    </div>
    <VcDialogCloseButton />
  </VcDialog>
</template>
```

`VcDialog` is a convenience wrapper that handles portal, overlay, and content internally. Props: `v-model:isOpen`, `preventClickOutside`, `preventEsc`, `hideOverlay`, `teleportTargetId`, `variant`.

### Compound parts for custom layout

When you need full control over overlay, transitions, or content structure:

```vue
<VcDialogRoot v-model:is-open="isOpen">
  <VcDialogPortal>
    <VcDialogOverlay />
    <VcDialogOverlayTransition>
      <VcDialogContent>
        <VcDialogContentTransition>
          <VcDialogTitle>Custom layout</VcDialogTitle>
          <VcDialogDescription>Full control over transitions</VcDialogDescription>
          <VcDialogCloseButton />
        </VcDialogContentTransition>
      </VcDialogContent>
    </VcDialogOverlayTransition>
  </VcDialogPortal>
</VcDialogRoot>
```

### useDialog for typed imperative control

Define a dialog as a separate SFC, then open it from script code with typed props:

```vue
<!-- ConfirmDeleteDialog.vue -->
<script setup lang="ts">
import { VcDialog, VcDialogTitle, VcDialogDescription, VcButton } from '@wisemen/vue-core-components'

const props = defineProps<{
  itemName: string
}>()
</script>

<template>
  <VcDialog>
    <VcDialogTitle>Delete {{ itemName }}?</VcDialogTitle>
    <VcDialogDescription>This action cannot be undone.</VcDialogDescription>
    <VcButton @click="$emit('close')">Cancel</VcButton>
    <VcButton variant="primary" @click="$emit('close')">Delete</VcButton>
  </VcDialog>
</template>
```

```vue
<!-- Parent.vue -->
<script setup lang="ts">
import { useDialog, VcDialogContainer } from '@wisemen/vue-core-components'
import ConfirmDeleteDialog from './ConfirmDeleteDialog.vue'

const deleteDialog = useDialog(ConfirmDeleteDialog)

async function handleDelete(item: Item) {
  await deleteDialog.open({ itemName: item.name })
  // Code here runs after dialog closes
  await ItemService.delete(item.uuid)
}
</script>

<template>
  <VcButton @click="handleDelete(selectedItem)">Delete</VcButton>
  <VcDialogContainer v-bind="deleteDialog.triggerProps" />
</template>
```

`useDialog(Component)` returns `{ isOpen, open(props), close(), triggerProps }`. The `open()` method returns a Promise that resolves when the dialog emits `close`. You must render `VcDialogContainer` with `triggerProps` somewhere in the template — it's the mount point for the dialog.

### Toast notifications

```vue
<script setup lang="ts">
import { useToast } from '@wisemen/vue-core-components'

const toast = useToast()

async function handleSave() {
  try {
    await ContactService.update(contact)
    toast.success({ title: 'Saved', description: 'Contact updated successfully.' })
  }
  catch (error) {
    toast.error({ title: 'Error', description: 'Could not save contact.' })
  }
}
</script>
```

`useToast()` returns `{ success, error, info }`. Each method takes `{ title: string, description?: string, durationMs?: number }`. The `durationMs` overrides the VcConfigProvider `autoCloseToast` setting for that specific toast.

## Common Mistakes

### CRITICAL: Missing VcToastContainer

```vue
<!-- App.vue — no container -->
<template>
  <VcConfigProvider locale="en-US">
    <RouterView />
    <!-- useToast().success() queues a toast but nothing renders it -->
  </VcConfigProvider>
</template>
```

```vue
<template>
  <VcConfigProvider locale="en-US">
    <RouterView />
    <VcToastContainer />
  </VcConfigProvider>
</template>
```

`useToast` queues toast messages into a shared store. `VcToastContainer` is the component that reads that store and renders the visible toasts. Without it, toast calls silently do nothing — no error, no feedback.

Source: `src/components/toast/` — VcToastContainer wraps vue-sonner's `Toaster` and reads from the toast store.

### HIGH: Not rendering VcDialogContainer for useDialog

```vue
<!-- Dialog never appears — no mount point -->
<script setup lang="ts">
const dialog = useDialog(MyDialog)
await dialog.open({ title: 'Hello' })
</script>

<template>
  <!-- Missing VcDialogContainer! -->
</template>
```

```vue
<template>
  <VcDialogContainer v-bind="dialog.triggerProps" />
</template>
```

`useDialog` manages dialog state but `VcDialogContainer` is the actual render target. Without it in the template, `dialog.open()` updates the state but nothing renders. The `triggerProps` binding connects the container to the dialog instance.

Source: `src/components/dialog/` — VcDialogContainer renders the dialog component via dynamic `<component>`.

### HIGH: Using compound parts without VcDialogPortal

```vue
<!-- Dialog renders inline in the DOM instead of portaling to body -->
<VcDialogRoot v-model:is-open="isOpen">
  <VcDialogContent>
    <VcDialogTitle>Title</VcDialogTitle>
  </VcDialogContent>
</VcDialogRoot>
```

```vue
<VcDialogRoot v-model:is-open="isOpen">
  <VcDialogPortal>
    <VcDialogOverlay />
    <VcDialogContent>
      <VcDialogTitle>Title</VcDialogTitle>
    </VcDialogContent>
  </VcDialogPortal>
</VcDialogRoot>
```

When using compound parts directly (not the VcDialog wrapper), you must include VcDialogPortal. Without it, the dialog renders in its parent DOM position, causing z-index and overflow clipping issues. VcDialogOverlay provides the backdrop dimming. The convenience `VcDialog` wrapper handles both automatically.

Source: `src/components/dialog/VcDialog.vue` — internally wraps content in VcDialogRoot + VcDialogPortal + VcDialogOverlay.

## See Also

- [config-setup](../config-setup/SKILL.md) — VcConfigProvider toast and portal settings
- [form-field-usage](../form-field-usage/SKILL.md) — form inputs for dialog forms
