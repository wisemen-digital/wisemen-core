---
name: switch
description: >
  A toggle switch for boolean on/off state with optional thumb icons, size variants, and animated transitions. Built on Reka UI SwitchRoot with label, hint, and error message support.
type: component
library: vue-core-design-system
category: form-control
requires:
  - input-system
exports:
  - UISwitch
---

# UISwitch

A toggle switch for boolean on/off state with optional animated thumb icons and size variants.

## When to Use

- Settings or preferences that take effect immediately (enable dark mode, toggle notifications)
- Binary on/off controls where the visual metaphor of a physical switch is appropriate
- When you want animated icon transitions inside the thumb

**Use instead:** [UICheckbox](../checkbox/SKILL.md) for form fields that submit with a form, [UIRadioGroup](../radio-group/SKILL.md) for choosing between more than two options.

## Import

```ts
import { UISwitch } from '@wisemen/vue-core-design-system'
```

## Quick Start

```vue
<script setup lang="ts">
import { ref } from 'vue'
import { UISwitch } from '@wisemen/vue-core-design-system'

const isEnabled = ref<boolean>(false)
</script>

<template>
  <UISwitch
    v-model="isEnabled"
    label="Enable notifications"
  />
</template>
```

## Source Files

For full API details, read the props file. For usage examples, read the playground files.

- Props: `src/ui/switch/switch.props.ts`
- Component: `src/ui/switch/Switch.vue`
- Playground: `src/ui/switch/stories/`

## See Also

- [checkbox](../checkbox/SKILL.md) -- For form fields that submit with a form
- [radio-group](../radio-group/SKILL.md) -- For choosing between more than two options
