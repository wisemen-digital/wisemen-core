---
name: segmented-control
description: >
  A pill-shaped form control with an animated sliding highlight for single-select
  options, and a static-highlight variant for multi-select. Built on Reka UI
  RadioGroupRoot / CheckboxGroupRoot. Each segment supports an optional
  secondary description line under its label.
type: component
library: vue-core-design-system
category: form-control
requires:
  - input-system
exports:
  - UISegmentedControl
  - UISegmentedControlItem
  - UISegmentedControlGroup
  - UISegmentedControlGroupItem
---

# UISegmentedControl

A pill-shaped, single-select group of options with an animated sliding highlight behind the checked segment. `UISegmentedControlGroup` is the multi-select counterpart, using static (non-animated) active-state styling per segment.

## When to Use

- A small, fixed set of mutually exclusive options that benefits from a more visual presentation than a plain radio list (e.g. a notification-channel picker: Off / Email / In-app / Both)
- A multi-select set of short options styled the same way (e.g. a day-of-week picker), via `UISegmentedControlGroup`

**Use instead:** For a longer list of options, or when options don't fit comfortably as short pill labels, use `UIRadioGroup` / `UICheckboxGroup`. For switching between content panels, use `UITabs`.

## Import

```ts
import { UISegmentedControl, UISegmentedControlItem } from '@wisemen/vue-core-design-system'
import { UISegmentedControlGroup, UISegmentedControlGroupItem } from '@wisemen/vue-core-design-system'
```

## Quick Start

```vue
<script setup lang="ts">
import { ref } from 'vue'
import { UISegmentedControl, UISegmentedControlItem } from '@wisemen/vue-core-design-system'

const value = ref<string>('email')
</script>

<template>
  <UISegmentedControl v-model="value">
    <UISegmentedControlItem label="Off" value="off" />
    <UISegmentedControlItem label="Email" value="email" />
    <UISegmentedControlItem label="In-app" value="in-app" />
    <UISegmentedControlItem label="Both" value="both" />
  </UISegmentedControl>
</template>
```

Multi-select:

```vue
<script setup lang="ts">
import { ref } from 'vue'
import { UISegmentedControlGroup, UISegmentedControlGroupItem } from '@wisemen/vue-core-design-system'

const days = ref<string[]>(['monday'])
</script>

<template>
  <UISegmentedControlGroup v-model="days">
    <UISegmentedControlGroupItem label="Mo" value="monday" />
    <UISegmentedControlGroupItem label="Tu" value="tuesday" />
  </UISegmentedControlGroup>
</template>
```

## Field Props

Both root components extend the standard `InputWrapper` field props (`label`, `hint`, `errorMessage`, `isRequired`, `helpText`, `isHorizontal`, etc.), rendering the same label/hint/error layout as `TextField`/`Select`/`TextareaField`.

## Sizing

`UISegmentedControl`/`UISegmentedControlGroup` accept `size: 'md' | 'sm'`, matching `FieldWrapper`'s `h-8`/`h-7` control heights so segments align with sibling form fields (`TextField`, `Select`, etc.) in a form row — but only when no item has a `description`. As soon as any item in the group is given a `description`, segments grow to fit both lines (following the `TextareaField` precedent of owning a taller height rather than matching sibling fields) and no longer align to `size`.

## Source Files

For full API details, read the props file.

- Props: `src/ui/segmented-control/segmentedControl.props.ts`
- Components: `src/ui/segmented-control/SegmentedControl.vue`, `src/ui/segmented-control/SegmentedControlItem.vue`, `src/ui/segmented-control/SegmentedControlIndicator.vue`, `src/ui/segmented-control/SegmentedControlGroup.vue`, `src/ui/segmented-control/SegmentedControlGroupItem.vue`
- Playground: `src/ui/segmented-control/stories/`

## See Also

- [checkbox-group](../checkbox-group/SKILL.md) -- For longer or plain-list multi-select option sets
- [tabs](../tabs/SKILL.md) -- For switching between content panels, and the sliding-indicator technique this component's single-select indicator is ported from

`UIRadioGroup` (`src/ui/radio-group/`) is the plain-list single-select counterpart; it does not yet have its own `SKILL.md`.
