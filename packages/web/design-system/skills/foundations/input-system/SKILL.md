---
name: input-system
description: >
  The InputWrapper > FieldWrapper > native element architecture shared by all
  input components (TextField, TextareaField, NumberField, Select, Autocomplete,
  Checkbox, etc.). Covers the Input, InputWrapper, FieldWrapper, AutocompleteInput
  interfaces, their default constants, the useInput composable for ARIA generation,
  and the DisabledWithReason pattern. Load before implementing or modifying any
  input or form control component.
type: foundation
category: input-architecture
library: vue-core-design-system
library_version: "0.8.0"
sources:
  - "packages/web/design-system/src/types/input.type.ts"
  - "packages/web/design-system/src/types/disabledWithReason.type.ts"
  - "packages/web/design-system/src/composables/input.composable.ts"
  - "packages/web/design-system/src/ui/input-wrapper/InputWrapper.vue"
  - "packages/web/design-system/src/ui/field-wrapper/FieldWrapper.vue"
---

# Input System

The shared architecture underlying all input and form control components.

## Overview

Every input component is built on a three-layer composition stack:

```
InputWrapper          (label, hint, error message, help text)
  └── FieldWrapper    (border, icons, loading spinner, placeholder)
        └── <input>   (native element or custom control)
```

Props flow through this stack via interface inheritance. A component like `TextFieldProps` extends `Input`, `AutocompleteInput`, `InputWrapper`, and `FieldWrapper` — inheriting all their props automatically.

## Interfaces

### Input

Shared properties for the native input element itself.

```ts
interface Input extends DisabledWithReason {
  id?: string | null              // Element id (auto-generated if null)
  isReadonly?: boolean            // Read-only mode
  isRequired?: boolean           // Required field (shows asterisk)
  name?: string | null           // Native name attribute
  class?: string | null          // Additional CSS classes
  style?: Record<string, string> | null  // Additional inline styles
}
```

### InputWrapper

Properties for the label/hint/error area that wraps around the field.

```ts
interface InputWrapper extends DisabledWithReason {
  isHorizontal?: boolean         // Horizontal layout (label left, input right)
  isLabelHidden?: boolean        // Visually hidden label (sr-only)
  isRequired?: boolean           // Shows asterisk next to label
  errorMessage?: string | null   // Error text below input
  for?: string | null            // Label for attribute
  helpText?: string | null       // Tooltip text next to label (shows help icon)
  hideErrorMessage?: boolean     // Hide error text (border still shows)
  hint?: string | null           // Help text below input
  label?: string | null          // Label text above input
}
```

### FieldWrapper

Properties for the bordered input area with icons and loading state.

```ts
interface FieldWrapper {
  isDisabled?: boolean           // Disables the input
  isLoading?: boolean            // Shows loading spinner
  isReadonly?: boolean           // Read-only state
  iconLeft?: Component | null    // Left icon component
  iconRight?: Component | null   // Right icon component
  placeholder?: string | null    // Placeholder text
}
```

### AutocompleteInput

```ts
interface AutocompleteInput {
  autocomplete?: string          // Native autocomplete attribute (default: 'off')
}
```

### DisabledWithReason

Adds tooltip explanation when a field is disabled.

```ts
interface DisabledWithReason {
  isDisabled?: boolean           // Whether the element is disabled
  disabledReason?: string | null // Tooltip shown on hover when disabled
}
```

## Default Constants

Use these when setting `withDefaults()` in components:

```ts
const INPUT_DEFAULTS = {
  id: null,
  isDisabled: false,
  disabledReason: null,
  isReadonly: false,
  isRequired: false,
  name: null,
  class: null,
  style: null,
}

const INPUT_META_DEFAULTS = {
  isDisabled: false,
  disabledReason: null,
  isHorizontal: false,
  isLabelHidden: false,
  isRequired: false,
  errorMessage: null,
  for: null,
  helpText: null,
  hideErrorMessage: false,
  hint: null,
  label: null,
}

const INPUT_FIELD_DEFAULTS = {
  isDisabled: false,
  isLoading: false,
  isReadonly: false,
  iconLeft: null,
  iconRight: null,
  placeholder: null,
}

const AUTOCOMPLETE_INPUT_DEFAULTS = {
  autocomplete: 'off',
}
```

## useInput Composable

Generates ARIA attributes for accessibility:

```ts
function useInput(id: string, options: Input & InputWrapper & FieldWrapper) {
  return {
    isError: ComputedRef<boolean>,        // true when errorMessage is set
    ariaBusy: ComputedRef<'true' | undefined>,
    ariaDescribedBy: ComputedRef<string | undefined>,
    ariaInvalid: ComputedRef<'true' | undefined>,
    ariaRequired: ComputedRef<'true' | undefined>,
  }
}
```

**ARIA mapping:**
- `errorMessage` set -> `aria-invalid="true"`, `aria-describedby` includes `{id}-error-message`
- `hint` set -> `aria-describedby` includes `{id}-hint`
- `isRequired` -> `aria-required="true"`
- `isLoading` -> `aria-busy="true"`

## How Components Compose

A typical input component (e.g., TextField):

```vue
<script setup lang="ts">
import type { TextFieldProps } from './textField.props'

const props = withDefaults(defineProps<TextFieldProps>(), {
  ...INPUT_DEFAULTS,
  ...INPUT_META_DEFAULTS,
  ...INPUT_FIELD_DEFAULTS,
  ...AUTOCOMPLETE_INPUT_DEFAULTS,
  size: 'md',
  type: 'text',
})

const modelValue = defineModel<string | null>({ required: true })
</script>

<template>
  <InputWrapper v-bind="inputWrapperProps">
    <FieldWrapper v-bind="fieldWrapperProps">
      <input
        v-model="modelValue"
        :type="props.type"
        :aria-invalid="ariaInvalid"
        :aria-describedby="ariaDescribedBy"
      />
    </FieldWrapper>
  </InputWrapper>
</template>
```

### Anatomy (TextField example)

```
InputWrapper
├── InputWrapperLabel          (label text + asterisk + help icon)
├── FieldWrapper
│   ├── FieldWrapperIcon       (iconLeft)
│   ├── <input>                (native element)
│   ├── FieldWrapperIcon       (iconRight) OR FieldWrapperLoader
│   └── slot#right
├── InputWrapperHint           (hint text)
└── InputWrapperErrorMessage   (error text)
```

## Common Mistakes

### CRITICAL: Not spreading all default objects

Wrong:
```ts
const props = withDefaults(defineProps<TextFieldProps>(), {
  size: 'md',
  // Missing INPUT_DEFAULTS, INPUT_META_DEFAULTS, etc.
})
```

Correct:
```ts
const props = withDefaults(defineProps<TextFieldProps>(), {
  ...INPUT_DEFAULTS,
  ...INPUT_META_DEFAULTS,
  ...INPUT_FIELD_DEFAULTS,
  ...AUTOCOMPLETE_INPUT_DEFAULTS,
  size: 'md',
  type: 'text',
})
```

Missing defaults cause `undefined` values that break null checks in InputWrapper/FieldWrapper.

### HIGH: Using native `disabled` attribute instead of `isDisabled` prop

Wrong:
```vue
<UITextField v-model="val" disabled />
```

Correct:
```vue
<UITextField v-model="val" :is-disabled="true" />
```

The component uses `isDisabled` to also control tooltips, ARIA attributes, and styling via data attributes.

### HIGH: Passing errorMessage without checking touched state

Wrong:
```vue
<UITextField
  v-model="field.modelValue.value"
  :error-message="field.errors.value?._errors?.[0]"
/>
<!-- Shows error immediately before user interacts -->
```

Correct:
```vue
<UITextField
  v-model="field.modelValue.value"
  :error-message="field.isTouched.value ? field.errors.value?._errors?.[0] : null"
/>
```

### MEDIUM: Setting both iconRight and isLoading

When `isLoading` is true, the loading spinner replaces `iconRight`. Don't expect both to show simultaneously — the loader takes priority.

## See Also

- [Architecture](../architecture/SKILL.md) — The parts pattern these components follow
- [text-field](../../components/text-field/SKILL.md) — Simplest input component using this system
- [select](../../components/select/SKILL.md) — Complex input with dropdown overlay
