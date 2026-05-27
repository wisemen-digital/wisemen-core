---
name: checkbox-group
description: >
  A group of checkboxes for multi-value selection with an optional
  indeterminate "select all" checkbox. Built on Reka UI CheckboxGroupRoot
  with a context-based registration system. Supports vertical and horizontal
  orientations and disabled state with reason tooltip.
type: component
library: vue-core-design-system
category: form-control
requires:
  - input-system
exports:
  - UICheckboxGroup
  - UICheckboxGroupCheckbox
  - UICheckboxGroupIndeterminateCheckbox
  - UICheckboxGroupProps
---

# UICheckboxGroup

A group of checkboxes for selecting multiple values from a set, with an optional "select all" indeterminate checkbox.

## When to Use

- Selecting multiple items from a predefined list (tags, permissions, features)
- When you need a "select all / deselect all" toggle for the entire group
- Multi-value form fields that need array-based v-model

**Use instead:** [UICheckbox](../checkbox/SKILL.md) for a single boolean, [UIRadioGroup](../radio-group/SKILL.md) for single-selection from multiple options, [UISelect](../select/SKILL.md) for multi-select in a dropdown.

## Import

```ts
import {
  UICheckboxGroup,
  UICheckboxGroupCheckbox,
  UICheckboxGroupIndeterminateCheckbox,
} from '@wisemen/vue-core-design-system'
```

## Quick Start

```vue
<script setup lang="ts">
import { ref } from 'vue'
import {
  UICheckboxGroup,
  UICheckboxGroupCheckbox,
} from '@wisemen/vue-core-design-system'

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

## API

### UICheckboxGroup (Root) Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `isDisabled` | `boolean` | `false` | Disables all checkboxes in the group. |
| `disabledReason` | `string \| null` | `null` | Tooltip text shown on hover when the group is disabled. |
| `orientation` | `'horizontal' \| 'vertical'` | `'vertical'` | Controls the keyboard navigation direction of the group. |

### UICheckboxGroup v-model

| Model | Type | Required | Description |
|-------|------|----------|-------------|
| `modelValue` | `TValue[]` | Yes | Array of selected values. Generic type `TValue` extends `AcceptableValue` (string, number, etc.). |

### UICheckboxGroupCheckbox Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `value` | `AcceptableInputValue` | **required** | The value this checkbox represents. Added to/removed from the group's modelValue array. |
| `label` | `string` | `undefined` | Label text displayed next to the checkbox. |
| `isLabelHidden` | `boolean` | `false` | Visually hides the label (sr-only). |
| `isDisabled` | `boolean` | `false` | Disables this individual checkbox. |
| `disabledReason` | `string \| null` | `null` | Tooltip text shown on hover when this checkbox is disabled. |

### UICheckboxGroupIndeterminateCheckbox Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `label` | `string \| null` | `null` | Label text for the "select all" checkbox. |

### Slots

| Component | Slot | Description |
|-----------|------|-------------|
| UICheckboxGroup | `default` | Place UICheckboxGroupCheckbox and UICheckboxGroupIndeterminateCheckbox here. |

### Emits

No custom events beyond `update:modelValue` on the root.

## Variants

### Orientation

| Value | Behavior |
|-------|----------|
| `vertical` | Keyboard navigation uses Up/Down arrow keys. Default. |
| `horizontal` | Keyboard navigation uses Left/Right arrow keys. |

Note: The `orientation` prop controls keyboard navigation direction only -- visual layout (flex-row vs flex-col) is your responsibility via CSS on a wrapper element.

## Examples

### Basic Usage

```vue
<script setup lang="ts">
import { ref } from 'vue'
import {
  UICheckboxGroup,
  UICheckboxGroupCheckbox,
} from '@wisemen/vue-core-design-system'

const fruits = ref<string[]>([])
</script>

<template>
  <UICheckboxGroup v-model="fruits">
    <div class="flex flex-col gap-sm">
      <UICheckboxGroupCheckbox value="apple" label="Apple" />
      <UICheckboxGroupCheckbox value="banana" label="Banana" />
      <UICheckboxGroupCheckbox value="cherry" label="Cherry" />
    </div>
  </UICheckboxGroup>
</template>
```

### With Formango

```vue
<script setup lang="ts">
import { useForm } from '@wisemen/formango'
import {
  UICheckboxGroup,
  UICheckboxGroupCheckbox,
} from '@wisemen/vue-core-design-system'
import { z } from 'zod'

const { form } = useForm({
  schema: z.object({
    permissions: z.array(z.string()).min(1, 'Select at least one permission'),
  }),
  onSubmit(values) {
    console.log(values)
  },
})

const permissions = form.register('permissions')
</script>

<template>
  <UICheckboxGroup v-model="permissions.modelValue.value">
    <div class="flex flex-col gap-sm">
      <UICheckboxGroupCheckbox value="read" label="Read" />
      <UICheckboxGroupCheckbox value="write" label="Write" />
      <UICheckboxGroupCheckbox value="delete" label="Delete" />
    </div>
  </UICheckboxGroup>
</template>
```

### With Select All (Indeterminate)

```vue
<script setup lang="ts">
import { ref } from 'vue'
import {
  UICheckboxGroup,
  UICheckboxGroupCheckbox,
  UICheckboxGroupIndeterminateCheckbox,
} from '@wisemen/vue-core-design-system'

const selected = ref<string[]>([])
</script>

<template>
  <UICheckboxGroup v-model="selected">
    <div class="flex flex-col gap-sm">
      <UICheckboxGroupIndeterminateCheckbox label="Select All" />
      <UICheckboxGroupCheckbox value="option1" label="Option 1" />
      <UICheckboxGroupCheckbox value="option2" label="Option 2" />
      <UICheckboxGroupCheckbox value="option3" label="Option 3" />
    </div>
  </UICheckboxGroup>
</template>
```

### Horizontal Layout

```vue
<script setup lang="ts">
import { ref } from 'vue'
import {
  UICheckboxGroup,
  UICheckboxGroupCheckbox,
} from '@wisemen/vue-core-design-system'

const tags = ref<string[]>([])
</script>

<template>
  <UICheckboxGroup v-model="tags" orientation="horizontal">
    <div class="flex items-center gap-lg">
      <UICheckboxGroupCheckbox value="vue" label="Vue" />
      <UICheckboxGroupCheckbox value="react" label="React" />
      <UICheckboxGroupCheckbox value="svelte" label="Svelte" />
    </div>
  </UICheckboxGroup>
</template>
```

### Custom Card Layout

```vue
<script setup lang="ts">
import { ref } from 'vue'
import {
  UICheckboxGroup,
  UICheckboxGroupCheckbox,
  UICheckboxGroupIndeterminateCheckbox,
} from '@wisemen/vue-core-design-system'

const selected = ref<string[]>([])

const options = [
  { title: 'Basic plan', description: 'Up to 10 users', value: 'basic' },
  { title: 'Business plan', description: 'Up to 50 users', value: 'business' },
]
</script>

<template>
  <UICheckboxGroup v-model="selected">
    <UICheckboxGroupIndeterminateCheckbox label="Select All" />
    <label
      v-for="option in options"
      :key="option.value"
      :for="`id-${option.value}`"
    >
      <div class="flex items-center justify-between rounded-md border p-md">
        <div>
          <p class="font-medium">{{ option.title }}</p>
          <p class="text-sm text-gray-500">{{ option.description }}</p>
        </div>
        <UICheckboxGroupCheckbox
          :id="`id-${option.value}`"
          :value="option.value"
          :is-label-hidden="true"
        />
      </div>
    </label>
  </UICheckboxGroup>
</template>
```

## Anatomy

```
ActionTooltip                      (shows disabledReason when group is disabled)
└── RekaCheckboxGroupRoot          (Reka UI, manages array v-model)
    └── slot#default
        ├── UICheckboxGroupIndeterminateCheckbox  (optional "select all")
        │   └── BaseCheckbox (isIndeterminate=true when partial)
        └── UICheckboxGroupCheckbox (one per option)
            └── BaseCheckbox
                └── InputWrapper (isHorizontal=true)
                    ├── RekaCheckboxRoot
                    │   └── div.control > CheckboxIndicator
                    ├── Label
                    └── Hint / ErrorMessage
```

## Styling

The UICheckboxGroup root has no style file of its own. Individual checkboxes use the BaseCheckbox styles from `src/ui/checkbox/base/baseCheckbox.style.ts` (see [checkbox](../checkbox/SKILL.md)).

## Common Mistakes

### CRITICAL: Forgetting to register checkboxes by not using UICheckboxGroupCheckbox

Wrong:
```vue
<UICheckboxGroup v-model="selected">
  <UICheckbox v-model="someBool" label="Option" />
  <!-- UICheckbox is NOT registered with the group! -->
</UICheckboxGroup>
```

Correct:
```vue
<UICheckboxGroup v-model="selected">
  <UICheckboxGroupCheckbox value="option" label="Option" />
</UICheckboxGroup>
```

UICheckboxGroupCheckbox internally calls `registerCheckbox` on mount and `unRegisterCheckbox` on unmount. Using plain UICheckbox inside a group will not update the group's modelValue.

### HIGH: Not wrapping checkboxes in a layout container

The UICheckboxGroup provides no default layout -- it renders a bare `<slot />`. You must wrap the checkboxes in a flex or grid container yourself:

```vue
<UICheckboxGroup v-model="selected">
  <!-- No gap/layout without a wrapper! -->
  <div class="flex flex-col gap-sm">
    <UICheckboxGroupCheckbox value="a" label="A" />
    <UICheckboxGroupCheckbox value="b" label="B" />
  </div>
</UICheckboxGroup>
```

### MEDIUM: Using wrong v-model type

Wrong:
```vue
const selected = ref<string>('')  // Wrong! Should be an array
```

Correct:
```vue
const selected = ref<string[]>([])
```

The v-model must be an array matching the type of the `value` props on the checkboxes.

## Accessibility

- Reka UI CheckboxGroupRoot handles `role="group"` semantics
- Individual checkboxes handle `role="checkbox"`, `aria-checked`, Space key toggling
- The indeterminate checkbox shows a dash icon and toggles all/none
- `orientation` controls arrow key navigation direction (Up/Down for vertical, Left/Right for horizontal)
- Disabled state on the group propagates to all child checkboxes

## See Also

- [input-system](../../foundations/input-system/SKILL.md) -- Inherited props and architecture
- [checkbox](../checkbox/SKILL.md) -- Single boolean checkbox
- [radio-group](../radio-group/SKILL.md) -- Single selection from multiple options
