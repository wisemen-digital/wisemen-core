---
name: overlay-system
description: >
  Imperative overlay management for @wisemen/vue-core-design-system. Covers the
  useOverlay composable (create, open, close, patch, closeAll), DialogContainer
  for rendering overlays, promise-based dialog results, and the useDialogTriggerProps
  helper. Load before working with Dialog, ConfirmDialog, FormDialog, or any
  imperative overlay pattern.
type: foundation
category: overlay-architecture
library: vue-core-design-system
library_version: "0.8.0"
sources:
  - "packages/web/design-system/src/ui/dialog/dialogOverlay.composable.ts"
  - "packages/web/design-system/src/ui/dialog/DialogContainer.vue"
  - "packages/web/design-system/src/ui/dialog/dialogTriggerProps.composable.ts"
---

# Overlay System

Imperative overlay management for dialogs, confirm dialogs, and form dialogs.

## Overview

The overlay system provides an imperative API for creating, opening, and closing dialogs from anywhere in your application. It is built on `createSharedComposable` from VueUse, meaning all components share a single overlay state.

**Two approaches to dialogs:**
1. **Template-driven** — use `v-model` on `UIDialog` directly (simple cases)
2. **Imperative** — use `useOverlay()` to create/open/close programmatically (complex workflows, awaiting results)

## useOverlay API

```ts
import { useOverlay } from '@wisemen/vue-core-design-system'

const overlay = useOverlay()
```

### create(component, options?)

Registers an overlay instance. Call once (typically at module scope or in setup).

```ts
const dialog = overlay.create(MyDialog, {
  defaultOpen: false,       // Start open? (default: false)
  destroyOnClose: false,    // Remove from DOM on close? (default: false)
  props: { title: 'Edit' }, // Initial props passed to the component
})
```

Returns an `OverlayInstance` with `open`, `close`, and `patch` methods.

### open(props?)

Opens the overlay. Optionally merges new props. Returns a promise-like object that resolves when the dialog emits `close`.

```ts
const result = dialog.open({ title: 'Edit User', userId: '123' })
const value = await result  // Resolves with the close event argument
```

If called with props, they merge with `originalProps` (from `create`). If called without props, the original props are used.

### close(value?)

Closes the overlay and resolves the open promise with the given value.

```ts
dialog.close('confirmed')  // Resolves the awaiting open() call with 'confirmed'
dialog.close()             // Resolves with undefined
```

### patch(props)

Updates the overlay's props without closing/reopening.

```ts
dialog.patch({ title: 'Updated Title' })
```

### closeAll()

Closes all registered overlays.

```ts
overlay.closeAll()
```

## DialogContainer

Renders all managed overlays. Place once at the app root.

```vue
<!-- App.vue -->
<template>
  <UIConfigProvider>
    <UIDialogContainer />
    <RouterView />
  </UIConfigProvider>
</template>
```

## Complete Example: Imperative Dialog

### Step 1: Create the dialog component

```vue
<!-- ConfirmDeleteDialog.vue -->
<script setup lang="ts">
import { UIDialog, UIDialogHeader, UIDialogBody, UIDialogFooter,
         UIDialogFooterCancel, UIDialogFooterPrimary } from '@wisemen/vue-core-design-system'

const props = defineProps<{
  itemName: string
}>()

const emit = defineEmits<{
  close: [confirmed: boolean]
}>()
</script>

<template>
  <UIDialog @close="emit('close', false)">
    <UIDialogHeader title="Delete Item" />
    <UIDialogBody>
      Are you sure you want to delete "{{ itemName }}"?
    </UIDialogBody>
    <UIDialogFooter>
      <UIDialogFooterCancel @click="emit('close', false)" />
      <UIDialogFooterPrimary
        label="Delete"
        variant="destructive-primary"
        @click="emit('close', true)"
      />
    </UIDialogFooter>
  </UIDialog>
</template>
```

### Step 2: Use overlay to manage it

```vue
<script setup lang="ts">
import { useOverlay } from '@wisemen/vue-core-design-system'
import ConfirmDeleteDialog from './ConfirmDeleteDialog.vue'

const overlay = useOverlay()
const deleteDialog = overlay.create(ConfirmDeleteDialog)

async function handleDelete(item: Item) {
  const confirmed = await deleteDialog.open({ itemName: item.name })

  if (confirmed) {
    await deleteItem(item.id)
  }
}
</script>

<template>
  <UIButton label="Delete" @click="handleDelete(item)" />
</template>
```

## useDialogTriggerProps

Helper for connecting a trigger element to a dialog's open state:

```ts
import { useDialogTriggerProps } from '@wisemen/vue-core-design-system'

const { triggerProps } = useDialogTriggerProps()
```

Used internally by components that need to pass trigger-related props to dialogs.

## Template-Driven Approach

For simple cases, use `v-model` directly:

```vue
<script setup lang="ts">
const isOpen = ref(false)
</script>

<template>
  <UIButton label="Open" @click="isOpen = true" />
  <UIDialog v-model="isOpen">
    <UIDialogHeader title="Simple Dialog" />
    <UIDialogBody>Content here</UIDialogBody>
  </UIDialog>
</template>
```

## Common Mistakes

### CRITICAL: Missing DialogContainer in app root

Wrong:
```vue
<!-- App.vue — no DialogContainer -->
<template>
  <RouterView />
</template>
```

Imperative overlays are created but never rendered. Nothing shows up.

Correct:
```vue
<template>
  <UIDialogContainer />
  <RouterView />
</template>
```

### HIGH: Creating overlay inside a loop or render function

Wrong:
```ts
function openDialog(item: Item) {
  const overlay = useOverlay()
  const dialog = overlay.create(MyDialog)  // Creates a new instance every call!
  dialog.open({ item })
}
```

Correct:
```ts
const overlay = useOverlay()
const dialog = overlay.create(MyDialog)  // Create once

function openDialog(item: Item) {
  dialog.open({ item })  // Reuse the instance
}
```

`create()` registers a new overlay each time. Call it once in setup, then reuse with `open()`.

### HIGH: Forgetting to emit 'close' from the dialog component

Wrong:
```vue
<!-- Dialog component that never emits 'close' -->
<UIDialogFooterPrimary label="Save" @click="save()" />
```

The overlay's `open()` promise never resolves.

Correct:
```vue
<UIDialogFooterPrimary label="Save" @click="save(); emit('close', result)" />
```

### MEDIUM: Not handling promise rejection

The `open()` promise resolves when `close()` is called. If the user dismisses the dialog (clicks backdrop, presses Escape), the close event fires with `undefined`. Always handle this case.

```ts
const result = await dialog.open()
if (result === undefined) return  // User dismissed
```

## See Also

- [dialog](../../components/dialog/SKILL.md) — UIDialog component and sub-components
- [confirm-dialog](../../components/confirm-dialog/SKILL.md) — Pre-built confirmation dialog
- [form-dialog](../../components/form-dialog/SKILL.md) — Dialog with form integration
