---
name: checkbox-group
description: >
  A group of checkboxes for multi-value selection with an optional indeterminate select all checkbox. Built on Reka UI CheckboxGroupRoot.
type: component
library: vue-core-design-system
category: form-control
requires:
  - input-system
exports:
  - UICheckboxGroup
  - UICheckboxGroupCheckbox
  - UICheckboxGroupIndeterminateCheckbox
---

# UICheckboxGroup

A group of checkboxes for selecting multiple values from a set, with an optional select all indeterminate checkbox.

## Import

```ts
import { UICheckboxGroup, UICheckboxGroupCheckbox, UICheckboxGroupIndeterminateCheckbox } from '@wisemen/vue-core-design-system'
```

## Quick Start

```vue
<script setup lang="ts">
import { ref } from 'vue'
import { UICheckboxGroup, UICheckboxGroupCheckbox } from '@wisemen/vue-core-design-system'

const selected = ref<string[]>([])
</script>

<template>
  <UICheckboxGroup v-model="selected">
    <UICheckboxGroupCheckbox value="option1" label="Option 1" />
    <UICheckboxGroupCheckbox value="option2" label="Option 2" />
    <UICheckboxGroupCheckbox value="option3" label="Option 3" />
  </UICheckboxGroup>
</template>
```

## Source Files

For full API details, read the props file.

- Props: `src/ui/checkbox-group/checkboxGroup.props.ts`
- Component: `src/ui/checkbox-group/CheckboxGroup.vue`


## See Also

- [checkbox](../checkbox/SKILL.md)
- [radio-group](../radio-group/SKILL.md)
