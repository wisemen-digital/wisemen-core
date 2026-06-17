<!-- This file was automatically generated. Do not edit it manually -->
<script setup lang="ts">
import Preview from '@/ui/select/stories/SelectPlayground.vue'

</script>

# Select

Select input for choosing one option from a menu of available values.

<ClientOnly>
  <DesignSystemPreview>
    <Preview />
  </DesignSystemPreview>
</ClientOnly>

[Open in Storybook](https://wisemen-digital.github.io/wisemen-core/storybook/?path=/story/components-select--default)

## Usage

Pass `items` (created with `createSelectOptions`) and a `displayFn` that returns the label string for a given value. Bind the selection with `v-model`.

```vue
<script setup lang="ts">
import { ref } from 'vue'
import { UISelect, createSelectOptions } from '@wisemen/vue-core'

interface User {
  id: number
  name: string
}

const users: User[] = [
  { id: 1, name: 'Alice Johnson' },
  { id: 2, name: 'Bob Smith' },
]

const items = createSelectOptions(users)
const selected = ref<User | null>(null)

function displayFn(user: User): string {
  return user.name
}
</script>

<template>
  <UISelect
    v-model="selected"
    :items="items"
    :display-fn="displayFn"
    label="User"
    placeholder="Select a user..."
  />
</template>
```

Enable search with `:search="'local'"` for client-side filtering, or `'remote'` to emit `update:search` events for server-side search.

## API

<!-- @include: ./select-meta.md -->
