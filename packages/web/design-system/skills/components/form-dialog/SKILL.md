---
name: form-dialog
description: >
  A dialog with integrated formango form handling. Wraps UIDialog with form context,
  automatic form ID generation, and optional unsaved-changes prompt. Uses FormDialogForm
  internally to connect to formango's Form type. Load this skill when building dialogs
  that contain validated forms.
type: component
library: vue-core-design-system
category: overlay
requires:
  - overlay-system
exports: []
# Note: UIFormDialog and FormDialogProps are internal components not exported from the dialog index.ts.
# They must be imported directly from source paths (see Import section).
---

# UIFormDialog

A dialog that integrates with formango for form state management, validation, and optional unsaved-changes prompting. It wraps UIDialog and provides a form context to all child components.

## When to Use

- Building a dialog that contains a validated form (create, edit, settings)
- When you need automatic form ID association between the dialog and a submit button
- When you want to prompt users about unsaved changes when they try to close the dialog

**Use instead:** `UIDialog` when you do not need form integration, `UIConfirmDialog` for simple yes/no confirmations.

## Import

> **Note:** UIFormDialog and FormDialogForm are currently internal components not exported from the dialog index. They are used by importing directly from the source:

```ts
// Internal import (not yet in public API)
import FormDialog from '@/ui/dialog/FormDialog.vue'
import FormDialogForm from '@/ui/dialog/FormDialogForm.vue'
```

When using the design system externally, check if these have been added to the public exports.

## Quick Start

```vue
<script setup lang="ts">
import { useForm } from 'formango'
import { z } from 'zod'
import FormDialog from '@/ui/dialog/FormDialog.vue'
import FormDialogForm from '@/ui/dialog/FormDialogForm.vue'
import {
  UIDialogHeader, UIDialogBody, UIDialogFooter,
  UIDialogFooterCancel, UIDialogFooterSubmit,
} from '@wisemen/vue-core-design-system'

const emit = defineEmits<{ close: [] }>()

const { form } = useForm({
  schema: z.object({
    name: z.string().min(1),
  }),
  initialState: {
    name: '',
  },
  onSubmit: async (values) => {
    await saveItem(values)
    emit('close')
  },
})
</script>

<template>
  <FormDialog :form="form" size="md" @close="emit('close')">
    <template #default="{ formId }">
      <UIDialogHeader title="Create Item" />
      <UIDialogBody>
        <FormDialogForm>
          <template #default="{ formId: innerFormId }">
            <!-- Form fields here -->
          </template>
        </FormDialogForm>
      </UIDialogBody>
      <UIDialogFooter>
        <template #right>
          <UIDialogFooterCancel label="Cancel" />
          <UIDialogFooterSubmit label="Save" :form="formId" />
        </template>
      </UIDialogFooter>
    </template>
  </FormDialog>
</template>
```

## API

### Props (FormDialog)

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `form` | `Form<any>` | -- (required) | The formango form instance. |
| `size` | `'xxs' \| 'xs' \| 'sm' \| 'md' \| 'lg' \| 'xl' \| 'full-screen'` | `'md'` | The width of the dialog. |
| `preventClickOutside` | `boolean` | `false` | Prevents closing by clicking the backdrop. |
| `preventEsc` | `boolean` | `false` | Prevents closing by pressing Escape. |
| `showCloseButton` | `boolean` | `true` | Whether to show the X close button. |
| `promptOnUnsavedChanges` | `boolean` | `false` | When true, shows a prompt if the user tries to close with unsaved changes. |
| `renderOwnFormComponent` | `boolean` | `false` | When true, the dialog does not render a FormDialogForm internally; the consumer must render their own `<form>` element. |
| `chin` | `ChinConfig \| null` | `null` | Chin configuration (inherited from DialogProps). |

### Slots (FormDialog)

| Slot | Slot Props | Description |
|------|------------|-------------|
| `default` | `{ formId: string }` | Dialog content. The `formId` can be passed to UIDialogFooterSubmit's `form` prop to associate the submit button with the form. |

### Emits (FormDialog)

| Event | Payload | Description |
|-------|---------|-------------|
| `close` | -- | Fired when the dialog should close. |

### FormDialogForm

An internal form wrapper that connects to the FormDialog context. It renders a `UIForm` with the form instance and ID from the parent FormDialog.

| Slot | Slot Props | Description |
|------|------------|-------------|
| `default` | `{ formId: string }` | Form content (fields, layouts). |

FormDialogForm automatically:
- Uses the form instance from the FormDialog context
- Uses the auto-generated form ID
- Applies `promptOnUnsavedChanges` from the FormDialog context

## Variants

Inherits all size variants from UIDialog. See [dialog](../dialog/SKILL.md) for the full size table.

## Examples

### Imperative Form Dialog

**Step 1: Create the form dialog component**

```vue
<!-- CreateUserDialog.vue -->
<script setup lang="ts">
import { useForm } from 'formango'
import { z } from 'zod'
import FormDialog from '@/ui/dialog/FormDialog.vue'
import FormDialogForm from '@/ui/dialog/FormDialogForm.vue'
import {
  UIDialogHeader, UIDialogBody, UIDialogFooter,
  UIDialogFooterCancel, UIDialogFooterSubmit, UITextField,
} from '@wisemen/vue-core-design-system'

const emit = defineEmits<{ close: [] }>()

const { form, register } = useForm({
  schema: z.object({
    firstName: z.string().min(1),
    lastName: z.string().min(1),
    email: z.string().email(),
  }),
  initialState: {
    firstName: '',
    lastName: '',
    email: '',
  },
  onSubmit: async (values) => {
    await createUser(values)
    emit('close')
  },
})

const firstName = register('firstName')
const lastName = register('lastName')
const email = register('email')
</script>

<template>
  <FormDialog
    :form="form"
    :prompt-on-unsaved-changes="true"
    size="md"
    @close="emit('close')"
  >
    <template #default="{ formId }">
      <UIDialogHeader title="Create User" />
      <UIDialogBody>
        <FormDialogForm>
          <div class="grid grid-cols-2 gap-lg">
            <UITextField v-bind="firstName" label="First name" />
            <UITextField v-bind="lastName" label="Last name" />
          </div>
          <UITextField v-bind="email" label="Email" class="mt-lg" />
        </FormDialogForm>
      </UIDialogBody>
      <UIDialogFooter>
        <template #right>
          <UIDialogFooterCancel label="Cancel" />
          <UIDialogFooterSubmit label="Create" :form="formId" />
        </template>
      </UIDialogFooter>
    </template>
  </FormDialog>
</template>
```

**Step 2: Open imperatively**

```vue
<script setup lang="ts">
import { useOverlay, UIButton, UIDialogContainer } from '@wisemen/vue-core-design-system'
import CreateUserDialog from './CreateUserDialog.vue'

const overlay = useOverlay()
const createDialog = overlay.create(CreateUserDialog)
</script>

<template>
  <UIButton label="Create User" @click="createDialog.open()" />
  <UIDialogContainer />
</template>
```

### With Custom Form Component (renderOwnFormComponent)

When `renderOwnFormComponent` is true, FormDialog does not render FormDialogForm. You manage the form element yourself:

```vue
<FormDialog
  :form="form"
  :render-own-form-component="true"
  size="md"
  @close="emit('close')"
>
  <template #default="{ formId }">
    <UIDialogHeader title="Custom Form" />
    <UIDialogBody>
      <form :id="formId" @submit.prevent="form.submit()">
        <!-- Your custom form fields -->
      </form>
    </UIDialogBody>
    <UIDialogFooter>
      <template #right>
        <UIDialogFooterCancel label="Cancel" />
        <UIDialogFooterSubmit label="Save" :form="formId" />
      </template>
    </UIDialogFooter>
  </template>
</FormDialog>
```

## Anatomy

```
UIFormDialog
├── FormDialogContext (provides form, formId, promptOnUnsavedChanges)
└── UIDialog (all dialog props forwarded)
    └── <slot :form-id="id" />
        ├── UIDialogHeader
        ├── UIDialogBody
        │   └── FormDialogForm (optional, unless renderOwnFormComponent)
        │       └── UIForm (with form instance, id, promptOnUnsavedChanges)
        │           └── <slot :form-id="formId" />
        └── UIDialogFooter
            └── UIDialogFooterSubmit (:form="formId")
```

## Styling

**Style file:** No separate style file. Inherits all styling from UIDialog.

## Common Mistakes

### HIGH: Not passing formId to UIDialogFooterSubmit

The submit button must be associated with the form via the `form` prop. Without it, clicking "Submit" does nothing because the button is outside the `<form>` element.

```vue
<!-- Wrong: Submit button is disconnected from the form -->
<UIDialogFooterSubmit label="Save" />

<!-- Correct: Pass formId from the slot props -->
<FormDialog :form="form" @close="emit('close')">
  <template #default="{ formId }">
    ...
    <UIDialogFooterSubmit label="Save" :form="formId" />
  </template>
</FormDialog>
```

### HIGH: Forgetting to emit 'close' in onSubmit

The form dialog does not auto-close on successful submission. You must emit `close` in your `onSubmit` handler:

```ts
const { form } = useForm({
  onSubmit: async (values) => {
    await saveData(values)
    emit('close')  // Must close explicitly
  },
})
```

### MEDIUM: Using UIDialogFooterPrimary instead of UIDialogFooterSubmit

For form dialogs, use `UIDialogFooterSubmit` (which defaults to `type="submit"`) instead of `UIDialogFooterPrimary` (which defaults to `type="button"`). The submit type is required for the form association to work via the `form` attribute.

### LOW: Not wrapping fields in FormDialogForm

If `renderOwnFormComponent` is false (the default), your form fields must be inside `FormDialogForm` for validation to work:

```vue
<!-- Wrong: Fields outside FormDialogForm -->
<UIDialogBody>
  <UITextField v-bind="name" label="Name" />
</UIDialogBody>

<!-- Correct: Fields inside FormDialogForm -->
<UIDialogBody>
  <FormDialogForm>
    <UITextField v-bind="name" label="Name" />
  </FormDialogForm>
</UIDialogBody>
```

## Accessibility

- Inherits all accessibility features from UIDialog (focus trap, Escape, ARIA roles).
- The form is associated with the submit button via the HTML `form` attribute, which is a standard accessibility pattern.
- `promptOnUnsavedChanges` uses the browser's beforeunload mechanism and/or a custom prompt to warn users about losing form data.

## See Also

- [dialog](../dialog/SKILL.md) -- Base dialog component
- [confirm-dialog](../confirm-dialog/SKILL.md) -- Simple confirmation dialog
- [overlay-system](../../foundations/overlay-system/SKILL.md) -- useOverlay API
- [form](../form/SKILL.md) -- UIForm component and formango integration
