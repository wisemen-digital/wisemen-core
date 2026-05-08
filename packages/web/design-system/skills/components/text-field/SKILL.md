---
name: text-field
description: >
  Single-line text input with label, hint, error message, and icon support. Wraps a native input inside InputWrapper > FieldWrapper. Integrates with formango for form validation.
type: component
library: vue-core-design-system
category: input
requires:
  - input-system
exports:
  - UITextField
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

## Source Files

For full API details, read the props file. For usage examples, read the playground files.

- Props: `src/ui/text-field/textField.props.ts`
- Component: `src/ui/text-field/TextField.vue`
- Playground: `src/ui/text-field/stories/`

## See Also

- [textarea-field](../textarea-field/SKILL.md) -- For multi-line text input
- [number-field](../number-field/SKILL.md) -- For numeric values
- [autocomplete](../autocomplete/SKILL.md) -- For text with suggestions
