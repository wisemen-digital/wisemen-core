---
name: radio-group
description: >
  A radio group for single-value selection from multiple options. Built on Reka UI
  RadioGroupRoot with context-based item registration. Supports standard radio items
  and card-style items with descriptions.
type: component
library: vue-core-design-system
category: form-control
requires:
  - input-system
exports:
  - UIRadioGroup
  - UIRadioGroupItem
---

# UIRadioGroup

A radio group for selecting a single value from multiple options, with support for standard and card-style items.

## When to Use

- Selecting exactly one option from a small set (2-7 options)
- When all options should be visible at once (not hidden in a dropdown)
- When options benefit from descriptions (card variant)

**Use instead:** [UISelect](../select/SKILL.md) for larger option sets or when space is constrained, [UICheckboxGroup](../checkbox-group/SKILL.md) for multi-select, [UISwitch](../switch/SKILL.md) for binary on/off toggles.

## Import

```ts
import { UIRadioGroup, UIRadioGroupItem } from '@wisemen/vue-core-design-system'
```

## Quick Start

```vue
<script setup lang="ts">
import { ref } from 'vue'
import { UIRadioGroup, UIRadioGroupItem } from '@wisemen/vue-core-design-system'

const plan = ref<string | null>(null)
</script>

<template>
  <UIRadioGroup v-model="plan">
    <div class="flex flex-col gap-sm">
      <UIRadioGroupItem value="basic" label="Basic" />
      <UIRadioGroupItem value="pro" label="Pro" />
      <UIRadioGroupItem value="enterprise" label="Enterprise" />
    </div>
  </UIRadioGroup>
</template>
```

## Source Files

For full API details, read the props files. For usage examples, read the playground files.

- Props: `src/ui/radio-group/radioGroup.props.ts`, `src/ui/radio-group/radioGroupItem.props.ts`
- Components: `src/ui/radio-group/RadioGroup.vue`, `src/ui/radio-group/RadioGroupItem.vue`
- Playground: `src/ui/radio-group/stories/`

## See Also

- [checkbox-group](../checkbox-group/SKILL.md) -- For multi-select from a set
- [select](../select/SKILL.md) -- For larger option sets in a dropdown
- [switch](../switch/SKILL.md) -- For binary on/off toggles
