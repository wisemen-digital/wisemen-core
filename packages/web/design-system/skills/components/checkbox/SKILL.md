---
name: checkbox
description: >
  A single boolean checkbox with label, hint, error message, and animated check
  indicator. Built on Reka UI CheckboxRoot with InputWrapper in horizontal
  layout. Integrates with formango for form validation.
type: component
library: vue-core-design-system
category: form-control
requires:
  - input-system
exports:
  - UICheckbox
---

# UICheckbox

A single boolean checkbox with animated check indicator, label, hint, and error message support.

## When to Use

- Capturing a single boolean value (agree to terms, opt-in, enable feature)
- Individual on/off toggles with a text label
- Inside a form where you need validation on a required boolean field

**Use instead:** [UICheckboxGroup](../checkbox-group/SKILL.md) for selecting multiple values from a set, [UISwitch](../switch/SKILL.md) for on/off toggles that take effect immediately, [UIRadioGroup](../radio-group/SKILL.md) for single selection from multiple options.

## Import

```ts
import { UICheckbox } from '@wisemen/vue-core-design-system'
```

## Quick Start

```vue
<script setup lang="ts">
import { ref } from 'vue'
import { UICheckbox } from '@wisemen/vue-core-design-system'

const accepted = ref<boolean>(false)
</script>

<template>
  <UICheckbox
    v-model="accepted"
    label="I agree to the terms and conditions"
  />
</template>
```

## Source Files

For full API details, read the props file. For usage examples, read the playground files.

- Props: `src/ui/checkbox/checkbox.props.ts`
- Component: `src/ui/checkbox/Checkbox.vue`
- Playground: `src/ui/checkbox/stories/`

## See Also

- [checkbox-group](../checkbox-group/SKILL.md) -- For selecting multiple values from a set
- [switch](../switch/SKILL.md) -- For on/off toggles that take effect immediately
- [radio-group](../radio-group/SKILL.md) -- For single selection from multiple options
