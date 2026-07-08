<!-- This file was automatically generated. Do not edit it manually -->
<script setup lang="ts">
import Preview from '@/ui/autocomplete/stories/AutocompletePlayground.vue'

</script>

# Autocomplete

Searchable combobox input for selecting an item from an async or local option set.

<ClientOnly>
  <DesignSystemPreview>
    <Preview />
  </DesignSystemPreview>
</ClientOnly>

[Open in Storybook](https://wisemen-digital.github.io/wisemen-core/storybook/?path=/story/components-autocomplete--default)

## Usage

Pass `items` (created with `createAutocompleteOptions`) and a `displayFn`. The input field doubles as the search box. Bind the selected value with `v-model`.

```vue
<script setup lang="ts">
import { ref } from 'vue'
import { UIAutocomplete, createAutocompleteOptions } from '@wisemen/vue-core'

const items = createAutocompleteOptions(['Apple', 'Banana', 'Cherry', 'Mango'])
const selected = ref<string | null>(null)

function displayFn(value: string): string {
  return value
}
</script>

<template>
  <UIAutocomplete
    v-model="selected"
    :items="items"
    :display-fn="displayFn"
    label="Fruit"
    placeholder="Search..."
    search-mode="local"
  />
</template>
```

Set `:search-mode="'remote'"` to disable local filtering and instead handle the `update:search` event yourself (e.g. to query an API).

## API

<!-- @include: ./autocomplete-meta.md -->
