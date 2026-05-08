---
name: number-field
description: >
  Numeric input with locale-aware formatting, optional increment/decrement
  controls, min/max bounds, and step snapping. Built on Reka UI NumberField
  with InputWrapper > FieldWrapper composition. Integrates with formango for
  form validation.
type: component
library: vue-core-design-system
category: input
requires:
  - input-system
exports:
  - UINumberField
  - UINumberFieldProps
---

# UINumberField

A numeric input field with locale-aware number formatting, optional increment/decrement controls, min/max bounds, and configurable step values.

## When to Use

- Capturing numeric values: quantities, ages, prices, measurements
- When you need locale-aware number formatting (decimal/thousands separators)
- When you need increment/decrement buttons for stepping values
- When you need min/max constraints with step snapping

**Use instead:** [UITextField](../text-field/SKILL.md) for free-text input, [UITextField type="tel"](../text-field/SKILL.md) for phone numbers (formatted strings, not numbers).

## Import

```ts
import { UINumberField } from '@wisemen/vue-core-design-system'
```

## Quick Start

```vue
<script setup lang="ts">
import { ref } from 'vue'
import { UINumberField } from '@wisemen/vue-core-design-system'

const quantity = ref<number | null>(null)
</script>

<template>
  <UINumberField
    v-model="quantity"
    label="Quantity"
    placeholder="0"
  />
</template>
```

## API

### Props

> Inherits from: `Input`, `AutocompleteInput`, `InputWrapper`, `FieldWrapper` (see [input-system](../../foundations/input-system/SKILL.md))

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `formatOptions` | `Intl.NumberFormatOptions \| null` | `null` | Number formatting options using `Intl.NumberFormatOptions`. Controls display of decimals, currency, percentage, etc. |
| `max` | `number \| null` | `null` | Maximum allowed value. The increment button is disabled when the value reaches this limit. |
| `min` | `number \| null` | `null` | Minimum allowed value. The decrement button is disabled when the value reaches this limit. |
| `showControls` | `boolean` | `false` | When `true`, shows increment (+) and decrement (-) buttons on the left and right of the input. Also centers the input text. |
| `step` | `number` | `1` | The increment/decrement step value. Determines how much the value changes when using controls or arrow keys. |

### v-model

| Model | Type | Required | Description |
|-------|------|----------|-------------|
| `modelValue` | `number \| null` | Yes | The current numeric value. `null` means empty. |

### Slots

| Slot | Description |
|------|-------------|
| `label-left` | Content rendered to the left of the label text. |
| `label-right` | Content rendered to the right of the label text. |
| `left` | Content rendered inside the FieldWrapper, to the left of the input. Overrides the decrement button when `showControls` is true. |
| `right` | Content rendered inside the FieldWrapper, to the right of the input. Overrides the increment button when `showControls` is true. |

### Emits

| Event | Payload | Description |
|-------|---------|-------------|
| `blur` | `FocusEvent` | Emitted when the input loses focus. |

## Variants

The number field does not have size variants. When `showControls` is `true`, the input text is centered.

## Examples

### Basic Usage

```vue
<script setup lang="ts">
import { ref } from 'vue'
import { UINumberField } from '@wisemen/vue-core-design-system'

const age = ref<number | null>(null)
</script>

<template>
  <UINumberField
    v-model="age"
    :min="0"
    :max="150"
    label="Age"
    placeholder="Years"
    :is-required="true"
  />
</template>
```

### With Formango

```vue
<script setup lang="ts">
import { useForm } from '@wisemen/formango'
import { UINumberField } from '@wisemen/vue-core-design-system'
import { z } from 'zod'

const { form } = useForm({
  schema: z.object({
    quantity: z.number().min(1, 'Must be at least 1').max(99, 'Cannot exceed 99'),
  }),
  onSubmit(values) {
    console.log(values)
  },
})

const quantity = form.register('quantity')
</script>

<template>
  <UINumberField
    v-model="quantity.modelValue.value"
    :error-message="quantity.isTouched.value ? quantity.errors.value?._errors?.[0] ?? null : null"
    :is-required="true"
    :min="1"
    :max="99"
    label="Quantity"
    placeholder="0"
    @blur="quantity.setTouched()"
  />
</template>
```

### With Increment/Decrement Controls

```vue
<script setup lang="ts">
import { ref } from 'vue'
import { UINumberField } from '@wisemen/vue-core-design-system'

const quantity = ref<number | null>(1)
</script>

<template>
  <UINumberField
    v-model="quantity"
    :show-controls="true"
    :min="1"
    :max="99"
    :step="1"
    label="Quantity"
    hint="How many items?"
  />
</template>
```

### Currency Formatting

```vue
<script setup lang="ts">
import { ref } from 'vue'
import { UINumberField } from '@wisemen/vue-core-design-system'

const price = ref<number | null>(null)
</script>

<template>
  <UINumberField
    v-model="price"
    :format-options="{ style: 'currency', currency: 'EUR' }"
    :step="0.01"
    label="Price"
    placeholder="0.00"
  />
</template>
```

## Anatomy

```
InputWrapper
├── InputWrapperLabel          (label text + asterisk + help icon)
├── RekaNumberFieldRoot        (Reka UI number field root, handles formatting/locale)
│   └── FieldWrapper
│       ├── slot#left / RekaNumberFieldDecrement  (decrement button when showControls)
│       ├── RekaNumberFieldInput                  (formatted number input)
│       ├── slot#right / RekaNumberFieldIncrement (increment button when showControls)
│       ├── FieldWrapperIcon                      (iconRight) OR FieldWrapperLoader
│       └──
├── InputWrapperHint           (hint text)
└── InputWrapperErrorMessage   (error text)
```

## Styling

**Style file:** `src/ui/number-field/numberField.style.ts`
**tv() slots:**
- `input` -- The number input element. Truncated, transparent background, themed text. Includes placeholder, read-only, and disabled states.
- `leftControl` -- Padding for the decrement button area (`pl-xs`).
- `rightControl` -- Padding for the increment button area (`pr-xs`).

When `showControls` is `true`, the `input` slot adds `text-center` to center the value between the buttons.

## Common Mistakes

### CRITICAL: Passing errorMessage without checking touched state

Wrong:
```vue
<UINumberField
  v-model="field.modelValue.value"
  :error-message="field.errors.value?._errors?.[0]"
/>
```

Correct:
```vue
<UINumberField
  v-model="field.modelValue.value"
  :error-message="field.isTouched.value ? field.errors.value?._errors?.[0] ?? null : null"
  @blur="field.setTouched()"
/>
```

### HIGH: Using v-model with string type instead of number

Wrong:
```vue
<script setup lang="ts">
const value = ref<string>('')  // Wrong type!
</script>
<UINumberField v-model="value" />
```

Correct:
```vue
<script setup lang="ts">
const value = ref<number | null>(null)
</script>
<UINumberField v-model="value" />
```

The v-model type is `number | null`, not `string`. The component handles locale-aware parsing internally.

### MEDIUM: Expecting real-time v-model updates during typing

The underlying Reka UI NumberField only commits the formatted value on blur or Enter key press. During typing, the raw input is parsed and the numeric `modelValue` is updated via a custom `onInput` handler, but the displayed formatted text only syncs on blur. This is by design for locale-aware formatting.

## Accessibility

- `useInput` composable auto-generates: `aria-invalid`, `aria-describedby`, `aria-required`, `aria-busy`
- Reka UI NumberField handles: arrow key increment/decrement, Home/End for min/max
- Increment/decrement buttons have accessible labels via `i18n.t('component.number_field.increment')` and `i18n.t('component.number_field.decrement')`
- `disable-wheel-change` is set to `true` to prevent accidental value changes when scrolling
- Keyboard: Arrow Up/Down to increment/decrement, Enter to commit value

## See Also

- [input-system](../../foundations/input-system/SKILL.md) -- Inherited props and architecture
- [text-field](../text-field/SKILL.md) -- Single-line text input for non-numeric values
