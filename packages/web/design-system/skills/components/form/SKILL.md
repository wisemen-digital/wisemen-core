---
name: form
description: >
  Form wrapper that integrates with formango's Form object to provide submit handling,
  unsaved changes detection with route-leave guards, and a context for child components
  like FormSubmitButton. Always pair with a formango useForm() call.
type: component
library: vue-core-design-system
library_version: "0.8.0"
category: infrastructure
requires: []
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

## API

### UIForm Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `form` | `Form<any>` | required | The formango `Form` object returned by `useForm()`. Provides submit handling, dirty tracking, and validation state. |
| `promptOnUnsavedChanges` | `boolean` | required | When `true`, intercepts route navigation and browser tab close when the form is dirty, showing a confirmation dialog. |
| `id` | `string \| null` | `null` | Custom form element ID. When `null`, an auto-generated ID is used. Useful when the submit button is outside the form element. |

### UIForm Slots

| Slot | Description |
|------|-------------|
| `default` | Form content (fields, buttons, layout). All children can inject the form context. |

### UIForm Emits

This component has no custom events. Form submission is handled by formango's `form.submit()` which is called on the native `submit` event.

### UIFormSubmitButton Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `label` | `string` | required | The button label text. |
| `variant` | `'primary' \| 'secondary'` | `'primary'` | The button variant. |
| `disableKeyboardShortcut` | `boolean` | `false` | When `true`, disables the Cmd+Enter / Ctrl+Enter keyboard shortcut for submission. |

### UIFormSubmitButton Slots

| Slot | Description |
|------|-------------|
| `default` | Override the default `UIButton` rendering entirely. The slot receives no props but the component still handles keyboard shortcuts and form binding. |

### useInjectFormContext

Inject the form context in any descendant component:

```ts
import { useInjectFormContext } from '@wisemen/vue-core-design-system'

const { formId, form } = useInjectFormContext()
// formId: string - the form element's ID
// form: Form<any> - the formango Form object
```

## Variants

This component has no visual variants.

## Examples

### Basic Form with Unsaved Changes

```vue
<script setup lang="ts">
import { useForm, useFormField } from 'formango'
import { z } from 'zod'
import { UIForm, UIFormSubmitButton } from '@wisemen/vue-core-design-system'
import { UITextField } from '@wisemen/vue-core-design-system'

const { form } = useForm({
  schema: z.object({
    firstName: z.string().min(1, 'First name is required'),
    lastName: z.string().min(1, 'Last name is required'),
  }),
  onSubmit: async (values) => {
    await updateProfile(values)
  },
})

const firstName = useFormField('firstName', form)
const lastName = useFormField('lastName', form)
</script>

<template>
  <UIForm :form="form" :prompt-on-unsaved-changes="true">
    <UITextField
      v-model="firstName.value.value"
      :error-message="firstName.errors.value"
      label="First name"
    />
    <UITextField
      v-model="lastName.value.value"
      :error-message="lastName.errors.value"
      label="Last name"
    />
    <UIFormSubmitButton label="Save changes" />
  </UIForm>
</template>
```

### Submit Button Outside the Form

```vue
<script setup lang="ts">
import { useForm } from 'formango'
import { z } from 'zod'
import { UIForm, UIFormSubmitButton } from '@wisemen/vue-core-design-system'

const { form } = useForm({
  schema: z.object({ name: z.string().min(1) }),
  onSubmit: async (values) => { /* ... */ },
})
</script>

<template>
  <UIForm id="my-form" :form="form" :prompt-on-unsaved-changes="false">
    <!-- fields -->
  </UIForm>

  <!-- Button outside the form, linked via form ID -->
  <UIFormSubmitButton label="Save" />
</template>
```

When `UIFormSubmitButton` is placed outside the `<UIForm>` element, it uses the `formId` from the injected context to link to the correct form via the HTML `form` attribute. Note: the button must still be a descendant of the `UIForm` in the Vue component tree (not the DOM tree) for context injection to work. If the button is truly outside the component tree, pass the `id` prop to `UIForm` and use a native button with `form="my-form"`.

### Disabling Keyboard Shortcut

```vue
<UIFormSubmitButton
  label="Save"
  :disable-keyboard-shortcut="true"
/>
```

By default, `UIFormSubmitButton` registers a Cmd+Enter (Mac) / Ctrl+Enter (Windows) keyboard shortcut that triggers form submission. Set `:disable-keyboard-shortcut="true"` to disable this.

### Custom Submit Button

```vue
<UIFormSubmitButton label="Save">
  <MyCustomButton type="submit" />
</UIFormSubmitButton>
```

When using the default slot, the component still handles keyboard shortcuts and passes `is-loading` and `form` attributes via `Primitive`'s `as-child` to the slotted element.

## Anatomy

```
UIForm
  <form novalidate @submit.prevent="form.submit()">
    <slot />

UIFormSubmitButton
  Primitive (as-child, passes form/isLoading/type=submit)
    <slot>
      UIButton (label, variant, keyboard-shortcut-keys, form, is-loading)
    </slot>
```

## Styling

This component has no visual styling. The `<form>` element renders with no classes. All visual styling comes from the child components (fields, buttons, layout).

## Common Mistakes

### HIGH: Forgetting to pass the form object

Wrong:
```vue
<UIForm :prompt-on-unsaved-changes="true">
  <!-- Missing :form prop -- will error -->
</UIForm>
```

Correct:
```vue
<UIForm :form="form" :prompt-on-unsaved-changes="true">
```

The `form` prop is required. It must be the `Form` object returned by formango's `useForm()`.

### HIGH: Using UIFormSubmitButton outside the form context

Wrong:
```vue
<!-- UIFormSubmitButton is not a descendant of UIForm in the Vue tree -->
<UIForm :form="form" :prompt-on-unsaved-changes="false">
  <!-- fields -->
</UIForm>
<UIFormSubmitButton label="Save" />
```

`UIFormSubmitButton` calls `useInjectFormContext()` which requires it to be a descendant of `UIForm` in the Vue component tree. If you need the button in a different DOM location, keep it inside `UIForm` and use CSS positioning, or use a plain `UIButton` with `type="submit"` and the `form` attribute.

### MEDIUM: Setting promptOnUnsavedChanges on a create form

Consider whether `promptOnUnsavedChanges` is appropriate for your use case. On a "create" form, the user may have intentionally started filling in data and navigating away should warn them. On a "view" page with inline editing, it is essential. On a simple search/filter form, it is usually unnecessary.

### LOW: Not handling submission errors

The `UIFormSubmitButton` shows a loading state via `form.isSubmitting`. Make sure your `onSubmit` handler properly throws or handles errors so the loading state resolves:

```ts
const { form } = useForm({
  schema,
  onSubmit: async (values) => {
    try {
      await saveData(values)
    } catch (error) {
      // Handle error -- the form will stop showing the loading state
      throw error
    }
  },
})
```

## Accessibility

- The `<form>` element uses `novalidate` to prevent native browser validation, relying on formango's schema-based validation instead.
- `UIFormSubmitButton` renders a `<button type="submit">` linked to the form via the `form` attribute.
- The Cmd+Enter / Ctrl+Enter keyboard shortcut provides a universal submit action. The shortcut keys are displayed on the button via `UIButton`'s `keyboard-shortcut-keys` prop.
- The unsaved changes dialog is a `ConfirmDialog` with proper focus management and ARIA roles.
- The `beforeunload` event handler prevents accidental tab/window close when the form is dirty.

## See Also

- [UIButton](../button/) -- The underlying button component used by UIFormSubmitButton
- [input-system](../../foundations/input-system/) -- Shared input infrastructure used by form fields
