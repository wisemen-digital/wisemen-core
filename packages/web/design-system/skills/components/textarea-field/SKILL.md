---
name: textarea-field
description: >
  Multi-line text input with auto-resize, character count, and configurable
  resize behavior. Wraps a native <textarea> inside InputWrapper with its own
  bordered container. Integrates with formango for form validation.
type: component
library: vue-core-design-system
library_version: "0.8.0"
category: input
requires:
  - input-system
exports:
  - UITextareaField
  - UITextareaFieldProps
---

# UITextareaField

A multi-line text input field with label, hint, error message, optional character count, and configurable resize behavior.

## When to Use

- Capturing multi-line text: messages, descriptions, comments, notes
- When you need auto-growing textarea that expands with content
- When you need a character count limit displayed to the user

**Use instead:** [UITextField](../text-field/SKILL.md) for single-line text inputs.

## Import

```ts
import { UITextareaField } from '@wisemen/vue-core-design-system'
```

## Quick Start

```vue
<script setup lang="ts">
import { ref } from 'vue'
import { UITextareaField } from '@wisemen/vue-core-design-system'

const message = ref<string | null>(null)
</script>

<template>
  <UITextareaField
    v-model="message"
    label="Message"
    placeholder="Write your message..."
  />
</template>
```

## API

### Props

> Inherits from: `Input`, `AutocompleteInput`, `InputWrapper`, `DisabledWithReason` (see [input-system](../../foundations/input-system/SKILL.md))
>
> Note: TextareaField does NOT inherit from `FieldWrapper` -- it has its own bordered container with `placeholder` defined directly on its props.

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `isSpellCheckEnabled` | `boolean` | `false` | Whether the textarea has spell-check enabled via the native `spellcheck` attribute. |
| `maxHeight` | `string \| null` | `null` | Maximum height of the textarea (e.g. `'200px'`, `'10rem'`). Applied as inline style. |
| `maxLength` | `number \| null` | `null` | Maximum number of characters. When set, a character count (e.g. `12/500`) replaces the hint text. |
| `minHeight` | `string \| null` | `null` | Minimum height of the textarea (e.g. `'100px'`, `'5rem'`). Applied as inline style. |
| `placeholder` | `string \| null` | `null` | Placeholder text displayed when the textarea is empty. |
| `resize` | `'auto-vertical' \| 'none' \| 'vertical'` | `'none'` | Controls resize behavior. `auto-vertical` grows with content; `vertical` allows manual resize; `none` disables resizing. |

### v-model

| Model | Type | Required | Description |
|-------|------|----------|-------------|
| `modelValue` | `string \| null` | Yes | The current text value. `null` means empty. |

### Slots

| Slot | Description |
|------|-------------|
| `label-left` | Content rendered to the left of the label text. |
| `label-right` | Content rendered to the right of the label text. |
| `top` | Content rendered inside the bordered container, above the textarea. |
| `bottom` | Content rendered inside the bordered container, below the textarea. |

### Emits

This component has no custom events beyond the standard `update:modelValue`.

## Variants

### Resize

| Value | Behavior |
|-------|----------|
| `none` | Textarea cannot be resized. Default. |
| `vertical` | User can drag the bottom edge to resize vertically. |
| `auto-vertical` | Textarea auto-grows vertically to fit content. Combined with `maxHeight` to cap the growth. |

## Examples

### Basic Usage

```vue
<script setup lang="ts">
import { ref } from 'vue'
import { UITextareaField } from '@wisemen/vue-core-design-system'

const description = ref<string | null>(null)
</script>

<template>
  <UITextareaField
    v-model="description"
    label="Description"
    placeholder="Enter a description..."
    hint="Optional"
  />
</template>
```

### With Formango

```vue
<script setup lang="ts">
import { useForm } from '@wisemen/formango'
import { UITextareaField } from '@wisemen/vue-core-design-system'
import { z } from 'zod'

const { form } = useForm({
  schema: z.object({
    message: z.string().min(10, 'Message must be at least 10 characters'),
  }),
  onSubmit(values) {
    console.log(values)
  },
})

const message = form.register('message')
</script>

<template>
  <UITextareaField
    v-model="message.modelValue.value"
    :error-message="message.isTouched.value ? message.errors.value?._errors?.[0] ?? null : null"
    :is-required="true"
    label="Message"
    placeholder="Write your message..."
    resize="auto-vertical"
    @blur="message.setTouched()"
  />
</template>
```

### Auto-Resize with Max Height

```vue
<script setup lang="ts">
import { ref } from 'vue'
import { UITextareaField } from '@wisemen/vue-core-design-system'

const notes = ref<string | null>(null)
</script>

<template>
  <UITextareaField
    v-model="notes"
    label="Notes"
    placeholder="Start typing..."
    resize="auto-vertical"
    max-height="300px"
    min-height="100px"
  />
</template>
```

### Character Count

```vue
<script setup lang="ts">
import { ref } from 'vue'
import { UITextareaField } from '@wisemen/vue-core-design-system'

const bio = ref<string | null>(null)
</script>

<template>
  <UITextareaField
    v-model="bio"
    label="Bio"
    placeholder="Tell us about yourself..."
    :max-length="500"
  />
  <!-- Hint area shows "42/500" instead of custom hint text -->
</template>
```

### Toolbar with Top/Bottom Slots

```vue
<script setup lang="ts">
import { ref } from 'vue'
import { UITextareaField } from '@wisemen/vue-core-design-system'

const content = ref<string | null>(null)
</script>

<template>
  <UITextareaField
    v-model="content"
    label="Content"
    placeholder="Write here..."
  >
    <template #top>
      <div class="flex gap-2 border-b border-primary p-2">
        <!-- Toolbar buttons here -->
      </div>
    </template>
  </UITextareaField>
</template>
```

## Anatomy

```
InputWrapper
├── InputWrapperLabel          (label text + asterisk + help icon)
├── div.root                   (bordered container, replaces FieldWrapper)
│   ├── slot#top
│   ├── <textarea>             (native textarea element)
│   └── slot#bottom
├── InputWrapperHint           (hint text OR character count when maxLength is set)
└── InputWrapperErrorMessage   (error text)
```

Note: Unlike TextField and NumberField, TextareaField does NOT use FieldWrapper. It has its own bordered `div.root` container that wraps the textarea, with `top` and `bottom` slots for custom content.

## Styling

**Style file:** `src/ui/textarea-field/textareaField.style.ts`
**tv() slots:**
- `root` -- The bordered container. Includes focus-visible, error, and disabled states.
- `textarea` -- The native textarea. Themed text, placeholder, read-only, and disabled styles.

Resize variants control CSS `resize` property (`resize-none` for `none` and `auto-vertical`, `resize-y` for `vertical`).

The textarea has a default `min-h-20` (80px) and padding `px-md py-sm`.

## Common Mistakes

### CRITICAL: Passing errorMessage without checking touched state

Wrong:
```vue
<UITextareaField
  v-model="field.modelValue.value"
  :error-message="field.errors.value?._errors?.[0]"
/>
```

Correct:
```vue
<UITextareaField
  v-model="field.modelValue.value"
  :error-message="field.isTouched.value ? field.errors.value?._errors?.[0] ?? null : null"
  @blur="field.setTouched()"
/>
```

### HIGH: Setting maxLength without understanding hint override

When `maxLength` is set, the character count (e.g. `42/500`) replaces the `hint` prop entirely. If you need both a hint and a character count, you cannot use both simultaneously -- `maxLength` takes priority.

### MEDIUM: Using auto-vertical without maxHeight

```vue
<!-- Textarea grows unbounded, potentially pushing content off screen -->
<UITextareaField v-model="val" resize="auto-vertical" />
```

Consider setting `maxHeight` when using `auto-vertical` to prevent the textarea from growing beyond a reasonable size:

```vue
<UITextareaField v-model="val" resize="auto-vertical" max-height="300px" />
```

## Accessibility

- `useInput` composable auto-generates: `aria-invalid`, `aria-describedby`, `aria-required`
- `aria-describedby` links to hint/error message elements by id
- Label is associated via `for` attribute matching the textarea `id` (auto-generated if not provided)
- Native `maxlength` attribute is set when `maxLength` prop is provided, preventing over-typing
- `spellcheck` attribute controlled via `isSpellCheckEnabled`
- Keyboard: fully native `<textarea>` behavior (Tab to focus, Enter for new line, etc.)

## See Also

- [input-system](../../foundations/input-system/SKILL.md) -- Inherited props and architecture
- [text-field](../text-field/SKILL.md) -- Single-line text input
