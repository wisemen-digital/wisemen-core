---
name: text-field
description: >
  Single-line text input with label, hint, error message, and icon support.
  Wraps a native <input> inside InputWrapper > FieldWrapper. Supports size
  variants, multiple input types (text, email, password, etc.), and integrates
  with formango for form validation.
type: component
library: vue-core-design-system
library_version: "0.8.0"
category: input
requires:
  - input-system
exports:
  - UITextField
  - UITextFieldProps
---

# UITextField

A single-line text input field with built-in label, hint, error message, icons, and loading state.

## When to Use

- Capturing short text values: names, emails, passwords, phone numbers, URLs, search queries
- Any single-line text input that needs label, validation, and accessibility support
- When you need built-in formango integration for form validation

**Use instead:** [UITextareaField](../textarea-field/SKILL.md) for multi-line text, [UINumberField](../number-field/SKILL.md) for numeric values, [UIAutocomplete](../autocomplete/SKILL.md) for text with suggestions.

## Import

```ts
import { UITextField } from '@wisemen/vue-core-design-system'
```

## Quick Start

```vue
<script setup lang="ts">
import { ref } from 'vue'
import { UITextField } from '@wisemen/vue-core-design-system'

const name = ref<string | null>(null)
</script>

<template>
  <UITextField
    v-model="name"
    label="Name"
    placeholder="Enter your name..."
  />
</template>
```

## API

### Props

> Inherits from: `Input`, `AutocompleteInput`, `InputWrapper`, `FieldWrapper` (see [input-system](../../foundations/input-system/SKILL.md))

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `size` | `'md' \| 'sm'` | `'md'` | The size of the text field. Controls height (`h-8` for md, `h-7` for sm) and horizontal padding. |
| `type` | `'email' \| 'password' \| 'search' \| 'tel' \| 'text' \| 'time' \| 'url'` | `'text'` | The native input type attribute. |

### v-model

| Model | Type | Required | Description |
|-------|------|----------|-------------|
| `modelValue` | `string \| null` | Yes | The current text value. `null` means empty. |

### Slots

| Slot | Description |
|------|-------------|
| `label-left` | Content rendered to the left of the label text. |
| `label-right` | Content rendered to the right of the label text. |
| `left` | Content rendered inside the FieldWrapper, to the left of the input. |
| `right` | Content rendered inside the FieldWrapper, to the right of the input. |

### Emits

This component has no custom events beyond the standard `update:modelValue`.

### Exposed

| Property | Type | Description |
|----------|------|-------------|
| `input` | `Ref<HTMLInputElement>` | Template ref to the native `<input>` element. |

## Variants

### Size

| Size | Height | Padding |
|------|--------|---------|
| `md` | `h-8` (32px) | `px-md` |
| `sm` | `h-7` (28px) | `px-sm` |

## Examples

### Basic Usage

```vue
<script setup lang="ts">
import { ref } from 'vue'
import { UITextField } from '@wisemen/vue-core-design-system'

const email = ref<string | null>(null)
</script>

<template>
  <UITextField
    v-model="email"
    label="Email"
    placeholder="you@example.com"
    type="email"
    hint="We'll never share your email"
    :is-required="true"
  />
</template>
```

### With Formango

```vue
<script setup lang="ts">
import { useForm } from '@wisemen/formango'
import { UITextField } from '@wisemen/vue-core-design-system'
import { z } from 'zod'

const { form } = useForm({
  schema: z.object({
    firstName: z.string().min(1, 'First name is required'),
    lastName: z.string().min(1, 'Last name is required'),
  }),
  onSubmit(values) {
    console.log(values)
  },
})

const firstName = form.register('firstName')
const lastName = form.register('lastName')
</script>

<template>
  <UITextField
    v-model="firstName.modelValue.value"
    :error-message="firstName.isTouched.value ? firstName.errors.value?._errors?.[0] ?? null : null"
    :is-required="true"
    label="First Name"
    placeholder="John"
    @blur="firstName.setTouched()"
  />
  <UITextField
    v-model="lastName.modelValue.value"
    :error-message="lastName.isTouched.value ? lastName.errors.value?._errors?.[0] ?? null : null"
    :is-required="true"
    label="Last Name"
    placeholder="Doe"
    @blur="lastName.setTouched()"
  />
</template>
```

### With Icons

```vue
<script setup lang="ts">
import { ref } from 'vue'
import { SearchIcon, MailIcon } from '@wisemen/vue-core-icons'
import { UITextField } from '@wisemen/vue-core-design-system'

const search = ref<string | null>(null)
</script>

<template>
  <UITextField
    v-model="search"
    :icon-left="SearchIcon"
    label="Search"
    placeholder="Search..."
    type="search"
  />
</template>
```

### Small Size

```vue
<script setup lang="ts">
import { ref } from 'vue'
import { UITextField } from '@wisemen/vue-core-design-system'

const value = ref<string | null>(null)
</script>

<template>
  <UITextField
    v-model="value"
    size="sm"
    label="Compact field"
    placeholder="Smaller input..."
  />
</template>
```

## Anatomy

```
InputWrapper
├── InputWrapperLabel          (label text + asterisk + help icon)
├── FieldWrapper
│   ├── FieldWrapperIcon       (iconLeft)
│   ├── slot#left
│   ├── <input>                (native input element)
│   ├── slot#right
│   ├── FieldWrapperIcon       (iconRight) OR FieldWrapperLoader
│   └──
├── InputWrapperHint           (hint text)
└── InputWrapperErrorMessage   (error text)
```

## Styling

**Style file:** `src/ui/text-field/textField.style.ts`
**tv() slots:**
- `input` -- The native input element. Truncated, transparent background, themed text colors. Includes placeholder, read-only, and disabled states.

Size variants control horizontal padding (`px-md` for md, `px-sm` for sm).

## Common Mistakes

### CRITICAL: Passing errorMessage without checking touched state

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
  :error-message="field.isTouched.value ? field.errors.value?._errors?.[0] ?? null : null"
  @blur="field.setTouched()"
/>
```

Always gate error display on `isTouched` so errors only appear after the user has interacted with the field.

### HIGH: Using native HTML attributes instead of component props

Wrong:
```vue
<UITextField v-model="val" disabled readonly required />
```

Correct:
```vue
<UITextField v-model="val" :is-disabled="true" :is-readonly="true" :is-required="true" />
```

The component uses `is-` prefixed boolean props to control ARIA attributes, data attributes, and disabled-reason tooltips.

### MEDIUM: Forgetting v-model is required

Wrong:
```vue
<UITextField label="Name" placeholder="Enter name..." />
<!-- TypeScript error: v-model is required -->
```

Correct:
```vue
<UITextField v-model="name" label="Name" placeholder="Enter name..." />
```

The `modelValue` is required. Always bind with `v-model`.

## Accessibility

- `useInput` composable auto-generates: `aria-invalid`, `aria-describedby`, `aria-required`, `aria-busy`
- `aria-describedby` links to hint and error message elements by id
- Label is associated via `for` attribute matching the input `id` (auto-generated if not provided)
- `isLabelHidden` renders the label with `sr-only` so it remains accessible to screen readers
- Keyboard: fully native `<input>` behavior (Tab to focus, type to enter, etc.)

## See Also

- [input-system](../../foundations/input-system/SKILL.md) -- Inherited props and architecture
- [textarea-field](../textarea-field/SKILL.md) -- Multi-line text input
- [number-field](../number-field/SKILL.md) -- Numeric input with formatting
