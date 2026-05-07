---
name: dialog-usage
description: >
  UIDialog compound component (UIDialogHeader, UIDialogBody, UIDialogFooter,
  UIDialogFooterCancel, UIDialogFooterSubmit), ConfirmDialog shorthand,
  useOverlay composable for imperative dialog management (open returns
  Promise, patch props, destroy on close). Dialog sizes, scroll-aware
  header/footer separators, preventEsc/preventClickOutside. Use when
  building modal dialogs or confirmation flows.
type: core
library: vue-core-design-system
library_version: "0.5.0"
requires:
  - getting-started
sources:
  - "wisemen-digital/wisemen-core:packages/web/design-system/src/ui/dialog/Dialog.vue"
  - "wisemen-digital/wisemen-core:packages/web/design-system/src/ui/dialog/DialogHeader.vue"
  - "wisemen-digital/wisemen-core:packages/web/design-system/src/ui/dialog/DialogBody.vue"
  - "wisemen-digital/wisemen-core:packages/web/design-system/src/ui/dialog/DialogFooter.vue"
  - "wisemen-digital/wisemen-core:packages/web/design-system/src/ui/dialog/ConfirmDialog.vue"
  - "wisemen-digital/wisemen-core:packages/web/design-system/src/ui/dialog/composables/useOverlay.ts"
---

# @wisemen/vue-core-design-system — Dialog Usage

## Setup

```vue
<script setup lang="ts">
import {
  UIDialog,
  UIDialogHeader,
  UIDialogBody,
  UIDialogFooter,
  UIDialogFooterCancel,
  UIDialogFooterSubmit,
} from '@wisemen/vue-core-design-system'
import { ref } from 'vue'

const isOpen = ref(false)

async function handleConfirm() {
  await saveChanges()
  isOpen.value = false
}
</script>

<template>
  <UIButton label="Edit" @click="isOpen = true" />

  <UIDialog v-model:is-open="isOpen" size="md">
    <UIDialogHeader title="Edit contact" description="Update the contact details below." />

    <UIDialogBody>
      <UITextField v-model="name" label="Name" />
      <UITextField v-model="email" label="Email" />
    </UIDialogBody>

    <UIDialogFooter>
      <UIDialogFooterCancel label="Cancel" @click="isOpen = false" />
      <UIDialogFooterSubmit label="Save" @click="handleConfirm" />
    </UIDialogFooter>
  </UIDialog>
</template>
```

UIDialog uses a compound structure: Header (sticky top with separator), Body (scrollable), Footer (sticky bottom with separator). The separators fade in when the body content is scrollable and the user scrolls away from the edge — this is handled automatically via a scroll observer in the dialog context.

Sizes: `'xxs'`, `'xs'`, `'sm'`, `'md'`, `'lg'`, `'xl'`, `'full-screen'`. On mobile all dialogs fill the screen width.

## Core Patterns

### ConfirmDialog shorthand

For simple confirm/cancel flows, use the built-in ConfirmDialog:

```vue
<script setup lang="ts">
import { ConfirmDialog } from '@wisemen/vue-core-design-system'
import { ref } from 'vue'

const isDeleteDialogOpen = ref(false)

async function handleDelete() {
  await deleteContact()
  isDeleteDialogOpen.value = false
}
</script>

<template>
  <UIButton label="Delete" variant="destructive-primary" @click="isDeleteDialogOpen = true" />

  <ConfirmDialog
    v-model:is-open="isDeleteDialogOpen"
    title="Delete contact?"
    description="This action cannot be undone."
    confirm-label="Delete"
    :on-confirm="handleDelete"
  />
</template>
```

ConfirmDialog is fixed at `size="xs"` and handles its own loading state during the `onConfirm` callback. It uses i18n for default button labels.

### useOverlay for imperative dialog management

When you need to open a dialog from script code and wait for its result:

```typescript
// composables/useDeleteConfirmation.ts
import { useOverlay } from '@wisemen/vue-core-design-system'
import { ConfirmDialog } from '@wisemen/vue-core-design-system'

export function useDeleteConfirmation() {
  const overlay = useOverlay()

  async function confirmDelete(itemName: string): Promise<boolean> {
    const dialog = overlay.create(ConfirmDialog)

    try {
      await dialog.open({
        title: `Delete ${itemName}?`,
        description: 'This action cannot be undone.',
        confirmLabel: 'Delete',
      })
      return true // User confirmed (dialog emitted 'close')
    }
    catch {
      return false // User cancelled
    }
  }

  return { confirmDelete }
}
```

```vue
<script setup lang="ts">
import { useDeleteConfirmation } from '@/composables'

const { confirmDelete } = useDeleteConfirmation()

async function handleDelete(contact: Contact) {
  const confirmed = await confirmDelete(contact.name)
  if (confirmed) {
    await ContactService.delete(contact.uuid)
  }
}
</script>
```

`useOverlay` is a shared composable (global state). `overlay.create(Component)` returns a handle with:
- `open(props)` — opens the dialog, returns a Promise that resolves when the dialog emits `close`
- `close(value)` — closes the dialog, resolves the open promise
- `patch(props)` — merges new props into the dialog while open

### Prevent accidental close

```vue
<UIDialog
  v-model:is-open="isOpen"
  prevent-esc
  prevent-click-outside
>
  <!-- User must explicitly click a button to close -->
  <UIDialogHeader title="Unsaved changes" />
  <UIDialogBody>You have unsaved changes.</UIDialogBody>
  <UIDialogFooter>
    <UIDialogFooterCancel label="Discard" @click="discard" />
    <UIDialogFooterSubmit label="Save" @click="save" />
  </UIDialogFooter>
</UIDialog>
```

### Custom dialog component

Define a reusable dialog as its own SFC:

```vue
<!-- EditContactDialog.vue -->
<script setup lang="ts">
import {
  UIDialog,
  UIDialogHeader,
  UIDialogBody,
  UIDialogFooter,
  UIDialogFooterCancel,
  UIDialogFooterSubmit,
} from '@wisemen/vue-core-design-system'

const props = defineProps<{ contact: Contact }>()
const emit = defineEmits<{ close: [] }>()

const name = ref(props.contact.name)

async function handleSave() {
  await ContactService.update(props.contact.uuid, { name: name.value })
  emit('close')
}
</script>

<template>
  <UIDialog size="sm">
    <UIDialogHeader title="Edit contact" />
    <UIDialogBody>
      <UITextField v-model="name" label="Name" />
    </UIDialogBody>
    <UIDialogFooter>
      <UIDialogFooterCancel label="Cancel" @click="emit('close')" />
      <UIDialogFooterSubmit label="Save" @click="handleSave" />
    </UIDialogFooter>
  </UIDialog>
</template>
```

Then open it imperatively via useOverlay:

```typescript
const overlay = useOverlay()
const dialog = overlay.create(EditContactDialog)
await dialog.open({ contact: selectedContact })
```

## Common Mistakes

### CRITICAL: Using UIDialog without compound children

```vue
<!-- No header/footer styling, no scroll-aware separators, no ARIA structure -->
<UIDialog v-model:is-open="isOpen">
  <h2>Title</h2>
  <p>Content</p>
  <button @click="isOpen = false">Close</button>
</UIDialog>
```

```vue
<UIDialog v-model:is-open="isOpen">
  <UIDialogHeader title="Title" />
  <UIDialogBody><p>Content</p></UIDialogBody>
  <UIDialogFooter>
    <UIDialogFooterCancel label="Close" @click="isOpen = false" />
  </UIDialogFooter>
</UIDialog>
```

UIDialog expects compound children (UIDialogHeader, UIDialogBody, UIDialogFooter). The header and footer are sticky with scroll-aware separator lines. The body is scrollable. Without the compound structure, you lose all of this plus the accessibility attributes (aria-labelledby from header title).

Source: `src/ui/dialog/Dialog.vue` — injects context that Header/Body/Footer consume for scroll detection.

### HIGH: Not emitting 'close' from custom dialog components

```vue
<!-- useOverlay.open() never resolves — dialog closes visually but promise hangs -->
<script setup lang="ts">
const props = defineProps<{ message: string }>()
// Missing: const emit = defineEmits<{ close: [] }>()
</script>

<template>
  <UIDialog>
    <UIDialogBody>{{ message }}</UIDialogBody>
    <UIDialogFooter>
      <!-- This closes the dialog but doesn't resolve the useOverlay promise -->
      <UIDialogFooterCancel label="OK" />
    </UIDialogFooter>
  </UIDialog>
</template>
```

```vue
<script setup lang="ts">
const props = defineProps<{ message: string }>()
const emit = defineEmits<{ close: [] }>()
</script>

<template>
  <UIDialog>
    <UIDialogBody>{{ message }}</UIDialogBody>
    <UIDialogFooter>
      <UIDialogFooterCancel label="OK" @click="emit('close')" />
    </UIDialogFooter>
  </UIDialog>
</template>
```

When using `useOverlay`, `dialog.open()` returns a Promise that resolves when the component emits `close`. If your custom dialog doesn't emit `close`, the promise never resolves and the calling code hangs at `await dialog.open()`.

Source: `src/ui/dialog/composables/useOverlay.ts` — resolves open promise on `close` event emission.

## See Also

- [getting-started](../getting-started/SKILL.md) — UIThemeProvider and CSS setup
- [select-usage](../select-usage/SKILL.md) — select inputs that may trigger dialogs
