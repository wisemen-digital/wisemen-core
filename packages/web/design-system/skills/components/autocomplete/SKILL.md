---
name: autocomplete
description: >
  Typeahead input that filters a dropdown list as the user types. Supports local client-side filtering and remote server-side search with debouncing.
type: component
library: vue-core-design-system
category: input
requires:
  - input-system
exports:
  - UIAutocomplete
  - createAutocompleteOptions
---

# UIAutocomplete

A combobox-style input that opens a filterable dropdown as the user types, powered by Reka UI's ComboboxRoot.

## When to Use

- When the user must select a single value from a large list by typing to narrow results
- When search results come from a remote API and need debounced fetching
- When you need avatar/icon/status decoration on each option via `getItemConfig`

**Use instead:** `UISelect` when the user should pick from a fixed list without typing; a plain `UITextField` when free-form text is acceptable.

## Import

```ts
import { UIAutocomplete, createAutocompleteOptions } from '@wisemen/vue-core-design-system'
```

## Quick Start

```vue
<script setup lang="ts">
import { ref } from 'vue'
import { UIAutocomplete, createAutocompleteOptions } from '@wisemen/vue-core-design-system'

const items = createAutocompleteOptions(['Apple', 'Banana', 'Cherry', 'Mango'])
const selected = ref<string | null>(null)

function displayFn(value: string): string {
  return value
}
</script>

<template>
  <UIAutocomplete
    v-model="selected"
    :display-fn="displayFn"
    :items="items"
    label="Fruit"
    placeholder="Search a fruit..."
    class="w-72"
  />
</template>
```

## Source Files

For full API details, read the props file. For usage examples, read the playground files.

- Props: `src/ui/autocomplete/autocomplete.props.ts`
- Component: `src/ui/autocomplete/Autocomplete.vue`
- Playground: `src/ui/autocomplete/stories/`

## See Also

- [select](../select/SKILL.md) -- For fixed-list selection without typing
- [text-field](../text-field/SKILL.md) -- For free-form text input
