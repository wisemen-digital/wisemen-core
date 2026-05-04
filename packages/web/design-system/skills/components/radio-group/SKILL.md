---
name: radio-group
description: >
  A radio group for single-value selection from multiple options. Built on
  Reka UI RadioGroupRoot with context-based item registration. Supports
  standard radio items and card-style items with descriptions. Includes
  vertical/horizontal orientation and disabled state with reason tooltip.
type: component
library: vue-core-design-system
library_version: "0.8.0"
category: form-control
requires:
  - input-system
exports:
  - UIRadioGroup
  - UIRadioGroupItem
  - UIRadioGroupItemProps
---

# UIRadioGroup

A radio group for selecting a single value from multiple options, with support for standard and card-style items.

## When to Use

- Selecting exactly one option from a small set (2-7 options)
- When all options should be visible at once (not hidden in a dropdown)
- When options benefit from descriptions (card variant)

**Use instead:** [UISelect](../select/SKILL.md) for larger option sets or when space is constrained (dropdown), [UICheckboxGroup](../checkbox-group/SKILL.md) for multi-select, [UISwitch](../switch/SKILL.md) for binary on/off toggles.

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

## API

### UIRadioGroup (Root) Props

> Inherits from: `Input`, `InputWrapper` (see [input-system](../../foundations/input-system/SKILL.md))

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `orientation` | `'horizontal' \| 'vertical'` | `'vertical'` | Controls the keyboard navigation direction of the radio group. |

### UIRadioGroup v-model

| Model | Type | Required | Description |
|-------|------|----------|-------------|
| `modelValue` | `TValue` | Yes | The currently selected value. Generic type `TValue` extends `AcceptableValue`. |

### UIRadioGroupItem Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `id` | `string \| null` | `null` | The id of the radio item element. |
| `isDisabled` | `boolean` | `false` | Disables this individual radio item. |
| `disabledReason` | `string \| null` | `null` | Tooltip shown on hover when this item is disabled. |
| `isLabelHidden` | `boolean` | `false` | Visually hides the label (sr-only). Useful for custom card layouts. |
| `description` | `string \| null` | `null` | Description text displayed below the label. |
| `label` | `string` | **required** | Label text displayed next to the radio indicator. |
| `value` | `AcceptableInputValue` | **required** | The value this radio item represents. |

### Slots

| Component | Slot | Description |
|-----------|------|-------------|
| UIRadioGroup | `default` | Place UIRadioGroupItem components here. |

### Emits

| Component | Event | Payload | Description |
|-----------|-------|---------|-------------|
| UIRadioGroupItem | `blur` | none | Emitted when the radio item loses focus. |
| UIRadioGroupItem | `focus` | none | Emitted when the radio item gains focus. |

## Variants

### Orientation

| Value | Behavior |
|-------|----------|
| `vertical` | Keyboard navigation uses Up/Down arrow keys. Default. |
| `horizontal` | Keyboard navigation uses Left/Right arrow keys. |

Note: Like UICheckboxGroup, the `orientation` prop controls keyboard navigation only. Visual layout must be handled with CSS.

## Examples

### Basic Usage

```vue
<script setup lang="ts">
import { ref } from 'vue'
import { UIRadioGroup, UIRadioGroupItem } from '@wisemen/vue-core-design-system'

const color = ref<string | null>(null)
</script>

<template>
  <UIRadioGroup v-model="color">
    <div class="flex flex-col gap-sm">
      <UIRadioGroupItem value="red" label="Red" />
      <UIRadioGroupItem value="green" label="Green" />
      <UIRadioGroupItem value="blue" label="Blue" />
    </div>
  </UIRadioGroup>
</template>
```

### With Formango

```vue
<script setup lang="ts">
import { useForm } from '@wisemen/formango'
import { UIRadioGroup, UIRadioGroupItem } from '@wisemen/vue-core-design-system'
import { z } from 'zod'

const { form } = useForm({
  schema: z.object({
    plan: z.enum(['basic', 'pro', 'enterprise'], {
      errorMap: () => ({ message: 'Please select a plan' }),
    }),
  }),
  onSubmit(values) {
    console.log(values)
  },
})

const plan = form.register('plan')
</script>

<template>
  <UIRadioGroup v-model="plan.modelValue.value">
    <div class="flex flex-col gap-sm">
      <UIRadioGroupItem value="basic" label="Basic" />
      <UIRadioGroupItem value="pro" label="Pro" />
      <UIRadioGroupItem value="enterprise" label="Enterprise" />
    </div>
  </UIRadioGroup>
</template>
```

### With Descriptions

```vue
<script setup lang="ts">
import { ref } from 'vue'
import { UIRadioGroup, UIRadioGroupItem } from '@wisemen/vue-core-design-system'

const plan = ref<string | null>(null)
</script>

<template>
  <UIRadioGroup v-model="plan">
    <div class="flex flex-col gap-sm">
      <UIRadioGroupItem
        value="basic"
        label="Basic plan"
        description="Includes up to 10 users"
      />
      <UIRadioGroupItem
        value="pro"
        label="Pro plan"
        description="Includes up to 50 users"
      />
      <UIRadioGroupItem
        value="enterprise"
        label="Enterprise plan"
        description="Unlimited users"
      />
    </div>
  </UIRadioGroup>
</template>
```

### Horizontal Layout

```vue
<script setup lang="ts">
import { ref } from 'vue'
import { UIRadioGroup, UIRadioGroupItem } from '@wisemen/vue-core-design-system'

const size = ref<string | null>(null)
</script>

<template>
  <UIRadioGroup v-model="size" orientation="horizontal">
    <div class="flex items-center gap-lg">
      <UIRadioGroupItem value="sm" label="Small" />
      <UIRadioGroupItem value="md" label="Medium" />
      <UIRadioGroupItem value="lg" label="Large" />
    </div>
  </UIRadioGroup>
</template>
```

### Disabled with Reason

```vue
<script setup lang="ts">
import { ref } from 'vue'
import { UIRadioGroup, UIRadioGroupItem } from '@wisemen/vue-core-design-system'

const plan = ref<string | null>(null)
</script>

<template>
  <UIRadioGroup
    v-model="plan"
    :is-disabled="true"
    disabled-reason="You don't have permission to change this setting"
  >
    <div class="flex flex-col gap-sm">
      <UIRadioGroupItem value="basic" label="Basic" />
      <UIRadioGroupItem value="pro" label="Pro" />
    </div>
  </UIRadioGroup>
</template>
```

## Anatomy

```
ActionTooltip                    (shows disabledReason when group is disabled)
└── RekaRadioGroupRoot           (Reka UI, manages single-value selection)
    └── slot#default
        └── UIRadioGroupItem (one per option)
            └── BaseRadioGroup
                └── ActionTooltip  (per-item disabledReason)
                    └── RekaRadioGroupItem
                        └── RowLayout
                            ├── div.control          (circular radio indicator)
                            │   └── RadioGroupIndicator  (animated dot)
                            └── ColumnLayout
                                ├── UIText (label)
                                └── UIText (description, optional)
```

## Styling

**Style file:** `src/ui/radio-group/base/baseRadioGroup.style.ts`
**tv() slots:**
- `root` -- The clickable radio item wrapper. Flex layout with cursor and disabled styles.
- `cardRoot` -- Alternative card-style wrapper with border, padding, and active state highlight.
- `control` -- The 16x16 circular radio indicator. Includes checked (brand color fill), disabled, error, and focus-visible states.
- `indicator` -- The inner dot (6x6 white circle) with spring animation on selection.
- `label` -- The label text. Medium weight, primary color.
- `description` -- The description text. Tertiary color, smaller size.

The radio indicator uses Motion (motion-v) with spring animation for the dot appearance.

## Common Mistakes

### CRITICAL: Not wrapping items in a layout container

The UIRadioGroup renders a bare `<slot />` with no layout. You must provide your own flex/grid wrapper:

Wrong:
```vue
<UIRadioGroup v-model="val">
  <UIRadioGroupItem value="a" label="A" />
  <UIRadioGroupItem value="b" label="B" />
  <!-- Items stack with no gap -->
</UIRadioGroup>
```

Correct:
```vue
<UIRadioGroup v-model="val">
  <div class="flex flex-col gap-sm">
    <UIRadioGroupItem value="a" label="A" />
    <UIRadioGroupItem value="b" label="B" />
  </div>
</UIRadioGroup>
```

### HIGH: Confusing orientation with visual layout

The `orientation` prop only affects keyboard navigation (arrow key direction), NOT visual layout. Setting `orientation="horizontal"` does NOT arrange items in a row -- you must add `flex-row` yourself.

### MEDIUM: Using UIRadioGroup for multi-select

UIRadioGroup is for single selection only. If you need multi-select, use [UICheckboxGroup](../checkbox-group/SKILL.md).

## Accessibility

- Reka UI RadioGroupRoot handles `role="radiogroup"`, `aria-orientation`
- Each RadioGroupItem gets `role="radio"`, `aria-checked`
- Keyboard: Arrow keys navigate between items, Space/Enter selects the focused item
- `orientation` prop maps to `aria-orientation` and determines which arrow keys navigate
- Disabled state propagates from the group to all items
- Per-item `disabledReason` shows tooltip on hover via ActionTooltip
- `data-invalid` attribute on items when parent has error, driving error border styles
- The `isLabelHidden` prop renders the label with `sr-only` for screen reader accessibility in custom layouts

## See Also

- [input-system](../../foundations/input-system/SKILL.md) -- Inherited props and architecture
- [checkbox-group](../checkbox-group/SKILL.md) -- Multi-value selection
- [select](../select/SKILL.md) -- Single selection in a dropdown
