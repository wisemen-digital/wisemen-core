---
name: number-field
description: >
  Numeric input with locale-aware formatting, optional increment/decrement
  controls, min/max bounds, and step snapping. Built on Reka UI NumberField
  with InputWrapper > FieldWrapper composition. Integrates with formango for
  form validation.
type: component
library: vue-core-design-system
category: input
requires:
  - input-system
exports:
  - UINumberField
---

# UINumberField

A numeric input field with locale-aware number formatting, optional increment/decrement controls, min/max bounds, and configurable step values.

## When to Use

- Capturing numeric values: quantities, ages, prices, measurements
- When you need locale-aware number formatting (decimal/thousands separators)
- When you need increment/decrement buttons for stepping values
- When you need min/max constraints with step snapping

**Use instead:** [UITextField](../text-field/SKILL.md) for free-text input, [UITextField type="tel"](../text-field/SKILL.md) for phone numbers.

## Import

```ts
import { UINumberField } from '@wisemen/vue-core-design-system'
```

## Quick Start

```vue
<script setup lang="ts">
import { ref } from 'vue'
import { UINumberField } from '@wisemen/vue-core-design-system'

const quantity = ref<number | null>(null)
</script>

<template>
  <UINumberField
    v-model="quantity"
    label="Quantity"
    placeholder="0"
  />
</template>
```

## Source Files

For full API details, read the props file. For usage examples, read the playground files.

- Props: `src/ui/number-field/numberField.props.ts`
- Component: `src/ui/number-field/NumberField.vue`
- Playground: `src/ui/number-field/stories/`

## See Also

- [text-field](../text-field/SKILL.md) -- For single-line text input
- [textarea-field](../textarea-field/SKILL.md) -- For multi-line text input
