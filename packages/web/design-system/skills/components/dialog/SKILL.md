---
name: dialog
description: >
  Modal dialog system with header, body, footer, and close button sub-components.
  Built on Reka UI DialogRoot with animated overlay, scroll-aware separators, and
  a chin feature for contextual actions. Supports both template-driven (v-model) and
  imperative (useOverlay) patterns. Also exports useOverlay composable and useDialogTriggerProps
  helper. Load this skill for any modal dialog implementation.
type: component
library: vue-core-design-system
category: overlay
requires:
  - overlay-system
exports:
  - UIDialog
  - UIDialogProps
  - UIDialogBody
  - UIDialogContainer
  - UIDialogFooter
  - UIDialogFooterCancel
  - UIDialogFooterPrimary
  - UIDialogFooterSecondary
  - UIDialogFooterSubmit
  - UIDialogHeader
  - UIDialogHeaderProps
  - UIDialogFooterButtonProps
  - UIDialogTriggerProps
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
  UIDialog,
  UIDialogBody,
  UIDialogContainer,
  UIDialogFooter,
  UIDialogFooterCancel,
  UIDialogFooterPrimary,
  UIDialogFooterSecondary,
  UIDialogFooterSubmit,
  UIDialogHeader,
  useOverlay,
  useDialogTriggerProps,
} from '@wisemen/vue-core-design-system'
```

## Quick Start

```vue
<script setup lang="ts">
import {
  UIDialog, UIDialogHeader, UIDialogBody, UIDialogFooter,
  UIDialogFooterCancel, UIDialogFooterPrimary,
} from '@wisemen/vue-core-design-system'

const emit = defineEmits<{
  close: []
}>()
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

## API

### Props (UIDialog)

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `isOpen` | `boolean` | `false` | Controls the open state (v-model). |
| `size` | `'xxs' \| 'xs' \| 'sm' \| 'md' \| 'lg' \| 'xl' \| 'full-screen'` | `'md'` | The width of the dialog. |
| `preventClickOutside` | `boolean` | `false` | Prevents closing the dialog by clicking the backdrop. |
| `preventEsc` | `boolean` | `false` | Prevents closing the dialog by pressing Escape. |
| `showCloseButton` | `boolean` | `true` | Whether to show the X close button in the top-right corner. |
| `chin` | `ChinConfig \| null` | `null` | Configuration for the chin panel below the dialog (see Chin section). |

### Slots (UIDialog)

| Slot | Description |
|------|-------------|
| `default` | Dialog content. Compose with UIDialogHeader, UIDialogBody, and UIDialogFooter. |

### Emits (UIDialog)

| Event | Payload | Description |
|-------|---------|-------------|
| `update:isOpen` | `boolean` | Fired when the open state changes. |
| `close` | -- | Fired when the dialog is closed (backdrop click, Escape, or close button). |
| `afterLeave` | -- | Fired after the close animation completes. |

## Sub-Components

### UIDialogContainer

Renders all managed overlays created via `useOverlay`. **Must be placed once at the app root.**

```vue
<!-- App.vue -->
<template>
  <UIDialogContainer />
  <RouterView />
</template>
```

No props, no slots, no emits.

---

### UIDialogHeader

Sticky header with title, optional description, optional icon, and a scroll-aware separator.

#### Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `title` | `string` | -- (required) | The title text displayed in the header. |
| `description` | `string \| null` | `null` | Optional description text below the title. |
| `icon` | `Component \| null` | `null` | Optional icon component displayed in a colored circle. |
| `iconVariant` | `'brand' \| 'error' \| 'success' \| 'warning'` | `'brand'` | Color variant for the icon container. |
| `showSeparator` | `boolean` | `true` | Whether to show the bottom separator line. |

The separator automatically fades out when the body is scrolled to the top, providing a clean visual when content is at rest.

---

### UIDialogBody

Scrollable content area with `overflow-y-auto`. Provides scroll state to the header and footer separators.

No props. Has a default slot for content.

```vue
<UIDialogBody>
  <p>Scrollable content here</p>
</UIDialogBody>
```

---

### UIDialogFooter

Sticky footer with left and right slot areas, separated by a scroll-aware divider.

#### Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `showSeparator` | `boolean` | `true` | Whether to show the top separator line. |

#### Slots

| Slot | Description |
|------|-------------|
| `left` | Content on the left side (e.g., a checkbox or secondary info). |
| `right` | Content on the right side (e.g., cancel and confirm buttons). |

The separator automatically fades out when the body is scrolled to the bottom.

---

### UIDialogFooterCancel

A cancel button that **automatically closes the dialog** (wraps Reka UI `DialogClose`). Uses `variant="secondary"`.

#### Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `label` | `string` | -- (required) | Button label text. |
| `isDisabled` | `boolean` | `false` | Disables the button. |
| `isLoading` | `boolean` | `false` | Shows loading state. |
| `disabledReason` | `string \| null` | `null` | Tooltip text explaining why the button is disabled. |
| `iconLeft` | `Component \| null` | `null` | Icon before the label. |
| `iconRight` | `Component \| null` | `null` | Icon after the label. |
| `form` | `string \| null` | `null` | Associates the button with a form by ID. |
| `type` | `'button' \| 'submit' \| 'reset'` | `'button'` | The button type attribute. |

#### Emits

| Event | Payload | Description |
|-------|---------|-------------|
| `click` | -- | Fired when the button is clicked. The dialog closes automatically. |

---

### UIDialogFooterPrimary

A primary action button (does **not** auto-close the dialog). Uses `variant="primary"`.

#### Props

Same as UIDialogFooterCancel (extends `DialogFooterButtonProps`).

#### Emits

| Event | Payload | Description |
|-------|---------|-------------|
| `click` | -- | Fired when the button is clicked. |

**Note:** This button does NOT auto-close the dialog. You must explicitly emit `close` or call `overlay.close()` in the click handler.

---

### UIDialogFooterSecondary

A secondary action button (does **not** auto-close the dialog). Uses `variant="secondary"`.

#### Props

Same as UIDialogFooterCancel (extends `DialogFooterButtonProps`).

#### Emits

| Event | Payload | Description |
|-------|---------|-------------|
| `click` | -- | Fired when the button is clicked. |

---

### UIDialogFooterSubmit

A submit button for form dialogs. Uses `variant="primary"` and defaults to `type="submit"`.

#### Props

Same as UIDialogFooterCancel (extends `DialogFooterButtonProps`), except `type` defaults to `'submit'`.

#### Emits

| Event | Payload | Description |
|-------|---------|-------------|
| `click` | -- | Fired when the button is clicked. |

**Note:** This button does NOT auto-close the dialog. Typically used inside UIFormDialog where form submission handles the close logic.

## useOverlay

Imperative overlay management composable. See [overlay-system](../../foundations/overlay-system/SKILL.md) for full documentation.

```ts
const overlay = useOverlay()
const dialog = overlay.create(MyDialogComponent)

// Open and await result
const result = await dialog.open({ title: 'Edit' })

// Close programmatically
dialog.close(result)

// Update props without reopening
dialog.patch({ title: 'Updated' })

// Close all overlays
overlay.closeAll()
```

## useDialogTriggerProps

Helper that provides ARIA-compliant trigger props for a specific overlay instance.

```ts
import { useDialogTriggerProps } from '@wisemen/vue-core-design-system'

const overlay = useOverlay()
const dialog = overlay.create(MyDialog)
const { triggerProps } = useDialogTriggerProps(dialog.id)
```

Returns a computed object with:
- `aria-expanded`: `boolean` -- whether the dialog is open
- `aria-haspopup`: `'dialog'`
- `data-state`: `'open' | 'closed'`

Bind these to your trigger element:

```vue
<UIButton v-bind="triggerProps" label="Open" @click="dialog.open()" />
```

## Variants

### Size

| Size | Max Width |
|------|-----------|
| `xxs` | `sm:max-w-90` (360px) |
| `xs` | `sm:max-w-100` (400px) |
| `sm` | `sm:max-w-120` (480px) |
| `md` | `sm:max-w-140` (560px) |
| `lg` | `sm:max-w-160` (640px) |
| `xl` | `sm:max-w-180` (720px) |
| `full-screen` | `sm:max-w-[90vw]` with `h-[90vh]` |

On mobile (below `sm` breakpoint), the dialog renders as a bottom sheet with `rounded-t` corners.

## Examples

### Template-Driven

```vue
<script setup lang="ts">
import { ref } from 'vue'
import {
  UIDialog, UIDialogHeader, UIDialogBody, UIDialogFooter,
  UIDialogFooterCancel, UIDialogFooterPrimary, UIButton,
} from '@wisemen/vue-core-design-system'

const isOpen = ref(false)
</script>

<template>
  <UIButton label="Open" @click="isOpen = true" />

  <UIDialog v-model:is-open="isOpen" size="md">
    <UIDialogHeader title="Template Dialog" description="Using v-model." />
    <UIDialogBody>
      <p class="text-sm text-secondary">Content here</p>
    </UIDialogBody>
    <UIDialogFooter>
      <template #right>
        <UIDialogFooterCancel label="Cancel" />
        <UIDialogFooterPrimary label="Save" @click="isOpen = false" />
      </template>
    </UIDialogFooter>
  </UIDialog>
</template>
```

### Imperative (useOverlay)

**Step 1: Create the dialog component**

```vue
<!-- EditUserDialog.vue -->
<script setup lang="ts">
import {
  UIDialog, UIDialogHeader, UIDialogBody, UIDialogFooter,
  UIDialogFooterCancel, UIDialogFooterPrimary,
} from '@wisemen/vue-core-design-system'

const props = defineProps<{
  userId: string
  userName: string
}>()

const emit = defineEmits<{
  close: [saved: boolean]
}>()
</script>

<template>
  <UIDialog size="md" @close="emit('close', false)">
    <UIDialogHeader :title="`Edit ${userName}`" />
    <UIDialogBody>
      <p class="text-sm text-secondary">Edit form for user {{ userId }}</p>
    </UIDialogBody>
    <UIDialogFooter>
      <template #right>
        <UIDialogFooterCancel label="Cancel" @click="emit('close', false)" />
        <UIDialogFooterPrimary label="Save" @click="emit('close', true)" />
      </template>
    </UIDialogFooter>
  </UIDialog>
</template>
```

**Step 2: Open imperatively**

```vue
<script setup lang="ts">
import { useOverlay, UIButton } from '@wisemen/vue-core-design-system'
import EditUserDialog from './EditUserDialog.vue'

const overlay = useOverlay()
const editDialog = overlay.create(EditUserDialog)

async function handleEdit(user: { id: string, name: string }) {
  const saved = await editDialog.open({
    userId: user.id,
    userName: user.name,
  })

  if (saved) {
    // Refresh data
  }
}
</script>

<template>
  <UIButton label="Edit User" @click="handleEdit({ id: '1', name: 'John' })" />
</template>
```

### With Header Icon

```vue
<UIDialogHeader
  :icon="CheckCircleIcon"
  icon-variant="success"
  title="Success"
  description="Your changes have been saved."
/>
```

### With Footer Left Content

```vue
<UIDialogFooter>
  <template #left>
    <UICheckbox :model-value="false" label="Remember my choice" />
  </template>
  <template #right>
    <UIDialogFooterCancel label="Cancel" />
    <UIDialogFooterPrimary label="Confirm" />
  </template>
</UIDialogFooter>
```

### Scrollable Dialog with Separator Behavior

```vue
<UIDialog size="md">
  <UIDialogHeader
    title="Scrollable dialog"
    description="Separators appear when content overflows."
  />
  <UIDialogBody>
    <div class="flex flex-col gap-xl">
      <p v-for="i in 20" :key="i" class="text-sm text-secondary">
        Paragraph {{ i }}
      </p>
    </div>
  </UIDialogBody>
  <UIDialogFooter>
    <template #right>
      <UIDialogFooterCancel label="Cancel" />
      <UIDialogFooterPrimary label="Confirm" />
    </template>
  </UIDialogFooter>
</UIDialog>
```

The header separator fades in when the body is scrolled away from the top. The footer separator fades in when the body is scrolled away from the bottom.

### With Chin

The chin is a contextual action bar that slides out below the dialog (above on mobile). Use `useDialogChin()` to control it.

```vue
<script setup lang="ts">
import { AlertSquareIcon } from '@wisemen/vue-core-icons'
import { UIDialog, UIDialogHeader, UIDialogBody, UIDialogFooter,
         UIDialogFooterCancel, UIDialogFooterPrimary } from '@wisemen/vue-core-design-system'
import { useDialogChin } from '@wisemen/vue-core-design-system'

const emit = defineEmits<{ close: [] }>()
const dialogChin = useDialogChin()
</script>

<template>
  <UIDialog :chin="dialogChin.chin.value" size="md" @close="emit('close')">
    <UIDialogHeader title="With Chin" />
    <UIDialogBody>
      <p class="text-sm text-secondary">Content</p>
    </UIDialogBody>
    <UIDialogFooter>
      <template #right>
        <UIDialogFooterCancel label="Cancel" />
        <UIDialogFooterPrimary
          label="Show Chin"
          @click="dialogChin.open({
            icon: AlertSquareIcon,
            text: 'You have unsaved changes',
            variant: 'error',
            primaryAction: {
              type: 'button',
              action: () => dialogChin.close(),
              label: 'Save',
              variant: 'default',
            },
            secondaryAction: {
              type: 'button',
              action: () => dialogChin.close(),
              label: 'Discard',
              variant: 'destructive',
            },
          })"
        />
      </template>
    </UIDialogFooter>
  </UIDialog>
</template>
```

## Anatomy

```
UIDialog
├── RekaDialogRoot (v-model:open, modal=true)
���   ├── RekaDialogOverlay (animated backdrop)
│   └── RekaDialogContent (positioned, animated)
│       ├── <div> (content container with border, bg, clip)
│       │   ├── <slot />
│       │   │   ├── UIDialogHeader (sticky top)
│       │   │   │   ├── RowLayout
│       │   │   │   │   ├── Icon circle (if icon prop)
│       │   │   │   │   └── ColumnLayout (title + description)
│       │   │   │   └── UISeparator (scroll-aware opacity)
│       │   │   ├── UIDialogBody (overflow-y-auto)
│       │   │   │   └��─ <slot />
│       │   │   └── UIDialogFooter (sticky bottom)
│       │   │       ├── UISeparator (scroll-aware opacity)
│       │   │       └── RowLayout
│       │   ���           ├── <slot name="left" />
│       │   │           └── RowLayout
│       │   │               └─�� <slot name="right" />
│       │   └── DialogCloseButton (if showCloseButton)
│       └── DialogChin (if chin config provided)
```

## Styling

**Style file:** `src/ui/dialog/dialog.style.ts`
**tv() slots:**
- `body` -- `flex-1 overflow-y-auto px-xl py-xs`
- `chin` -- Absolutely positioned below the dialog with spring animation
- `content` -- Rounded container with border and background
- `contentWrapper` -- Fixed positioning, centered on desktop, bottom-sheet on mobile
- `footer` -- Sticky bottom with background
- `header` -- Sticky top with z-10
- `overlay` -- Fixed inset backdrop with gradient

**Animations:**
- Overlay: 400ms fade-in, 120ms fade-out
- Content: 400ms slide-up + fade-in, 120ms slide-down + fade-out
- Respects `prefers-reduced-motion: reduce`

## Common Mistakes

### CRITICAL: Missing UIDialogContainer in app root

```vue
<!-- Wrong: Imperative overlays will not render -->
<template>
  <RouterView />
</template>

<!-- Correct -->
<template>
  <UIDialogContainer />
  <RouterView />
</template>
```

### HIGH: Creating overlay instances inside event handlers

```ts
// Wrong: Creates a new instance on every click
function openDialog() {
  const overlay = useOverlay()
  const dialog = overlay.create(MyDialog) // Leaks!
  dialog.open()
}

// Correct: Create once in setup
const overlay = useOverlay()
const dialog = overlay.create(MyDialog)

function openDialog() {
  dialog.open()
}
```

### HIGH: Forgetting to emit 'close' from dialog component

```vue
<!-- Wrong: The overlay open() promise never resolves -->
<UIDialogFooterPrimary label="Save" @click="save()" />

<!-- Correct -->
<UIDialogFooterPrimary label="Save" @click="save(); emit('close', result)" />
```

### MEDIUM: Confusing FooterCancel with FooterPrimary close behavior

`UIDialogFooterCancel` auto-closes the dialog (wraps Reka UI `DialogClose`). `UIDialogFooterPrimary` does NOT auto-close -- you must handle closing explicitly. This is by design: primary actions often need to validate or save before closing.

### MEDIUM: Using UIDialogFooterSubmit outside a form context

`UIDialogFooterSubmit` defaults to `type="submit"`. It only works when inside a `<form>` element or when the `form` prop is set to a form ID. Outside of that context, the submit has no effect.

## Accessibility

- Built on Reka UI Dialog primitives with full ARIA compliance.
- Focus is trapped within the dialog while open.
- Escape key closes the dialog (unless `preventEsc` is true).
- Clicking the backdrop closes the dialog (unless `preventClickOutside` is true).
- `DialogTitle` uses `<h2>` semantics via `RekaDialogTitle`.
- `DialogDescription` uses `<p>` via `RekaDialogDescription`.
- The close button has an accessible label from i18n (`component.dialog.close`).
- Focus returns to the trigger element when the dialog closes.
- Animations respect `prefers-reduced-motion: reduce`.

## See Also

- [overlay-system](../../foundations/overlay-system/SKILL.md) -- useOverlay API, DialogContainer, promise-based results
- [confirm-dialog](../confirm-dialog/SKILL.md) -- Pre-built confirmation dialog
- [form-dialog](../form-dialog/SKILL.md) -- Dialog with form integration
