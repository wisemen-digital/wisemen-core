---
name: textarea-field
description: >
  Multi-line text input with auto-resize, character count, and configurable resize behavior. Wraps a native textarea inside InputWrapper. Integrates with formango for form validation.
type: component
library: vue-core-design-system
category: input
requires:
  - input-system
exports:
  - UITextareaField
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

## Source Files

For full API details, read the props file. For usage examples, read the playground files.

- Props: `src/ui/textarea-field/textareaField.props.ts`
- Component: `src/ui/textarea-field/TextareaField.vue`
- Playground: `src/ui/textarea-field/stories/`

## See Also

- [text-field](../text-field/SKILL.md) -- For single-line text input
