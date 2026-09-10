---
name: select
description: >
  Dropdown select component supporting single and multi-select modes with optional
  search (local or remote), pagination, and rich option rendering via getItemConfig.
  Determines single vs multi mode from the v-model type.
type: component
library: vue-core-design-system
category: input
requires:
  - input-system
exports:
  - UISelect
  - createSelectOptions
---

# UISelect

A dropdown select that supports single-select, multi-select, optional search filtering, pagination, and rich option rendering. Single vs multi mode is determined by the v-model type: pass a single value for single-select, pass an array for multi-select.

## When to Use

- When the user must pick one or more values from a predefined list without typing free text
- When options need rich decoration (avatars, icons, dots, descriptions)
- When the list is paginated and requires infinite scroll

**Use instead:** `UIAutocomplete` when the user should type to search (combobox pattern); `UIRadioGroup` or `UICheckboxGroup` when all options should be visible at once.

## Import

```ts
import { UISelect, createSelectOptions } from '@wisemen/vue-core-design-system'
```

## Quick Start

```vue
<script setup lang="ts">
import { ref } from 'vue'
import { UISelect, createSelectOptions } from '@wisemen/vue-core-design-system'

const items = createSelectOptions(['Apple', 'Banana', 'Cherry', 'Mango'])
const selected = ref<string | null>(null)

function displayFn(value: string): string {
  return value
}
</script>

<template>
  <UISelect
    v-model="selected"
    :display-fn="displayFn"
    :items="items"
    label="Fruit"
    placeholder="Select a fruit..."
    class="w-72"
  />
</template>
```

## Source Files

For full API details, read the props file. For usage examples, read the playground files.

- Props: `src/ui/select/select.props.ts`
- Components: `src/ui/select/Select.vue`, `src/ui/select/SelectDropdown.vue`, `src/ui/select/SelectOption.vue`
- Playground: `src/ui/select/stories/`

## See Also

- [autocomplete](../autocomplete/SKILL.md) -- For combobox-style typing to search
- [radio-group](../radio-group/SKILL.md) -- For visible single-select options
- [checkbox-group](../checkbox-group/SKILL.md) -- For visible multi-select options
