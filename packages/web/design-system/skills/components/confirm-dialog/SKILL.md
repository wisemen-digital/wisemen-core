---
name: confirm-dialog
description: >
  A pre-built confirmation dialog with title, description, icon, cancel button, and
  confirm button. Supports destructive styling and async confirm callbacks with automatic
  loading state. Uses the dialog sub-components internally. Load this skill for yes/no
  or delete confirmation prompts.
type: component
library: vue-core-design-system
category: overlay
requires:
  - overlay-system
exports:
  - UIConfirmDialog
  - UIConfirmDialogProps
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

## API

### Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `title` | `string` | -- (required) | The title displayed in the dialog header. |
| `description` | `string` | -- (required) | The description text displayed below the title. |
| `confirmLabel` | `string \| null` | `null` | Label for the confirm button. Falls back to i18n `component.unsaved_changes_dialog.confirm`. |
| `cancelLabel` | `string \| null` | `null` | Label for the cancel button. Falls back to i18n `component.unsaved_changes_dialog.cancel`. |
| `isDestructive` | `boolean` | `false` | When true, the confirm button uses `destructive-primary` variant and the icon uses `error` color. |
| `icon` | `Component \| null` | `null` | Optional icon displayed in the header. |
| `onConfirm` | `(() => Promise<void> \| void) \| null` | `null` | Callback when the confirm button is clicked. If it returns a Promise, the button shows a loading spinner until the Promise resolves. |
| `preventClickOutside` | `boolean` | `false` | Prevents closing by clicking the backdrop. |
| `preventEsc` | `boolean` | `false` | Prevents closing by pressing Escape. |

### Slots

This component has no slots. All content is driven by props.

### Emits

| Event | Payload | Description |
|-------|---------|-------------|
| `close` | -- | Fired when the dialog should close (cancel clicked, backdrop clicked, or Escape pressed). |

## Variants

The dialog always renders at `size="xs"` with no close button. The only visual variant is `isDestructive`:

| `isDestructive` | Confirm Button Variant | Icon Variant |
|-----------------|----------------------|--------------|
| `false` | `primary` | `brand` |
| `true` | `destructive-primary` | `error` |

## Examples

### Template-Driven

```vue
<script setup lang="ts">
import { ref } from 'vue'
import { UIConfirmDialog, UIButton } from '@wisemen/vue-core-design-system'
import { Trash01Icon } from '@wisemen/vue-core-icons'

const isOpen = ref(false)
</script>

<template>
  <UIButton label="Delete" @click="isOpen = true" />

  <UIConfirmDialog
    v-if="isOpen"
    :is-destructive="true"
    :icon="Trash01Icon"
    title="Delete item"
    description="Are you sure? This cannot be undone."
    confirm-label="Delete"
    cancel-label="Cancel"
    :on-confirm="() => { /* delete logic */ }"
    @close="isOpen = false"
  />
</template>
```

### Imperative (useOverlay)

**Step 1: Create the confirm dialog component**

```vue
<!-- ConfirmDeleteDialog.vue -->
<script setup lang="ts">
import { UIConfirmDialog } from '@wisemen/vue-core-design-system'
import { Trash01Icon } from '@wisemen/vue-core-icons'

const props = defineProps<{
  itemName: string
}>()

const emit = defineEmits<{
  close: [confirmed: boolean]
}>()

async function handleConfirm() {
  // Perform the delete action
  emit('close', true)
}
</script>

<template>
  <UIConfirmDialog
    :is-destructive="true"
    :icon="Trash01Icon"
    title="Delete item"
    :description="`Are you sure you want to delete '${itemName}'?`"
    confirm-label="Delete"
    cancel-label="Cancel"
    :on-confirm="handleConfirm"
    @close="emit('close', false)"
  />
</template>
```

**Step 2: Open imperatively**

```vue
<script setup lang="ts">
import { useOverlay, UIButton } from '@wisemen/vue-core-design-system'
import ConfirmDeleteDialog from './ConfirmDeleteDialog.vue'

const overlay = useOverlay()
const confirmDialog = overlay.create(ConfirmDeleteDialog)

async function handleDelete(item: { id: string, name: string }) {
  const confirmed = await confirmDialog.open({ itemName: item.name })

  if (confirmed) {
    await api.delete(item.id)
  }
}
</script>

<template>
  <UIButton label="Delete" variant="destructive-primary" @click="handleDelete(item)" />
</template>
```

### Async Confirm with Loading State

```vue
<UIConfirmDialog
  title="Publish article"
  description="This will make the article visible to all users."
  confirm-label="Publish"
  cancel-label="Cancel"
  :on-confirm="async () => {
    await publishArticle()  // Button shows spinner during this
  }"
  @close="emit('close')"
/>
```

### Non-Destructive Confirmation

```vue
<UIConfirmDialog
  :is-destructive="false"
  title="Confirm changes"
  description="Do you want to apply these changes?"
  confirm-label="Apply"
  cancel-label="Cancel"
  :on-confirm="applyChanges"
  @close="emit('close')"
/>
```

## Anatomy

```
UIConfirmDialog
└── UIDialog (size="xs", no close button)
    ├── UIDialogHeader
    │   ├── Icon circle (if icon prop, colored by isDestructive)
    │   ├── Title (<h2>)
    │   └── Description (<p>)
    └── UIDialogFooter
        └── #right
            ├── UIDialogFooterCancel (emits close on click)
            └── UIButton (primary or destructive-primary)
```

## Styling

**Style file:** No separate style file. Uses UIDialog and sub-component styles.
The dialog is fixed at `size="xs"` (max-width 400px on desktop). The close button is hidden.

## Common Mistakes

### HIGH: Forgetting to emit 'close' after onConfirm

The `onConfirm` callback handles the action but does NOT close the dialog. You must emit `close` yourself after the action completes:

```ts
// Wrong: dialog stays open after confirm
const onConfirm = async () => {
  await deleteItem()
  // Dialog is still open!
}

// Correct: emit close after action
const onConfirm = async () => {
  await deleteItem()
  emit('close')
}
```

Alternatively, handle closing in the `onConfirm` callback and emit `close` from there.

### MEDIUM: Not providing confirmLabel/cancelLabel

If you omit `confirmLabel` or `cancelLabel`, the dialog falls back to i18n keys `component.unsaved_changes_dialog.confirm` and `component.unsaved_changes_dialog.cancel`. Make sure these keys exist in your i18n config, or always provide explicit labels.

### LOW: Using for complex forms

UIConfirmDialog has no body slot. For anything beyond a title and description, use UIDialog with UIDialogBody.

## Accessibility

- Inherits all accessibility features from UIDialog (focus trap, Escape to close, ARIA roles).
- The title is rendered as `<h2>` and description as `<p>` with proper ARIA associations.
- The confirm button clearly communicates the action via its label.
- When `isDestructive` is true, the visual styling communicates danger, but also consider using descriptive language in the title and description.

## See Also

- [dialog](../dialog/SKILL.md) -- Base dialog component with full customization
- [form-dialog](../form-dialog/SKILL.md) -- Dialog with form integration
- [overlay-system](../../foundations/overlay-system/SKILL.md) -- useOverlay API
