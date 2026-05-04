---
name: checkbox
description: >
  A single boolean checkbox with label, hint, error message, and animated check
  indicator. Built on Reka UI CheckboxRoot with InputWrapper in horizontal
  layout. Integrates with formango for form validation and with UICheckboxGroup
  for multi-select scenarios.
type: component
library: vue-core-design-system
library_version: "0.8.0"
category: form-control
requires:
  - input-system
exports:
  - UICheckbox
  - UICheckboxProps
---

# UICheckbox

A single boolean checkbox with animated check indicator, label, hint, and error message support.

## When to Use

- Capturing a single boolean value (agree to terms, opt-in, enable feature)
- Individual on/off toggles with a text label
- Inside a form where you need validation on a required boolean field

**Use instead:** [UICheckboxGroup](../checkbox-group/SKILL.md) for selecting multiple values from a set, [UISwitch](../switch/SKILL.md) for on/off toggles that take effect immediately (settings), [UIRadioGroup](../radio-group/SKILL.md) for single selection from multiple options.

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

## API

### Props

> Inherits from: `Input`, `AutocompleteInput`, `InputWrapper` (see [input-system](../../foundations/input-system/SKILL.md))
>
> Note: UICheckbox inherits from BaseCheckboxProps (which extends Input, InputWrapper, AutocompleteInput) but omits `isIndeterminate`. The checkbox does NOT inherit FieldWrapper -- it has its own control rendering.

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `value` | `AcceptableInputValue` | `undefined` | The value associated with this checkbox. Used when the checkbox is part of a CheckboxGroup. |

Note: The `isHorizontal` prop from InputWrapper is forced to `true` internally -- the checkbox always renders with the control on the left and the label on the right.

### v-model

| Model | Type | Required | Description |
|-------|------|----------|-------------|
| `modelValue` | `boolean` | Yes | Whether the checkbox is checked. |

### Slots

This component has no custom slots.

### Emits

| Event | Payload | Description |
|-------|---------|-------------|
| `blur` | none | Emitted when the checkbox loses focus. |

## Variants

This component has no size or visual variants.

## Examples

### Basic Usage

```vue
<script setup lang="ts">
import { ref } from 'vue'
import { UICheckbox } from '@wisemen/vue-core-design-system'

const isEnabled = ref<boolean>(false)
</script>

<template>
  <UICheckbox
    v-model="isEnabled"
    label="Enable notifications"
    hint="You will receive email notifications"
  />
</template>
```

### With Formango

```vue
<script setup lang="ts">
import { useForm } from '@wisemen/formango'
import { UICheckbox } from '@wisemen/vue-core-design-system'
import { z } from 'zod'

const { form } = useForm({
  schema: z.object({
    acceptTerms: z.literal(true, {
      errorMap: () => ({ message: 'You must accept the terms' }),
    }),
  }),
  onSubmit(values) {
    console.log(values)
  },
})

const acceptTerms = form.register('acceptTerms')
</script>

<template>
  <UICheckbox
    v-model="acceptTerms.modelValue.value"
    :error-message="acceptTerms.isTouched.value ? acceptTerms.errors.value?._errors?.[0] ?? null : null"
    :is-required="true"
    label="I accept the terms and conditions"
    @blur="acceptTerms.setTouched()"
  />
</template>
```

### Disabled with Reason

```vue
<script setup lang="ts">
import { ref } from 'vue'
import { UICheckbox } from '@wisemen/vue-core-design-system'

const premium = ref<boolean>(false)
</script>

<template>
  <UICheckbox
    v-model="premium"
    :is-disabled="true"
    disabled-reason="Upgrade to premium to enable this feature"
    label="Premium feature"
  />
</template>
```

## Anatomy

```
InputWrapper (isHorizontal=true)
├── RekaCheckboxRoot           (Reka UI checkbox root, handles state)
│   └── div.control            (bordered checkbox square)
│       └── CheckboxIndicator  (animated check/indeterminate SVG)
├── InputWrapperLabel          (label text + asterisk)
├── InputWrapperHint           (hint text)
└── InputWrapperErrorMessage   (error text)
```

The checkbox uses the `isHorizontal` layout mode of InputWrapper, placing the control on the left and label + hint + error on the right.

## Styling

**Style file:** `src/ui/checkbox/base/baseCheckbox.style.ts`
**tv() slots:**
- `root` -- The clickable root element. Flex layout, cursor styles, disabled state.
- `control` -- The 16x16 bordered checkbox square. Includes checked (brand color), disabled, error, and focus-visible states.
- `indicator` -- The animated SVG check icon inside the control. White on brand background.

The check animation uses Motion (motion-v) with spring-based path animation for the checkmark SVG.

## Common Mistakes

### CRITICAL: Using UICheckbox for multi-select instead of UICheckboxGroup

Wrong:
```vue
<UICheckbox v-model="options.includes('a')" label="Option A" />
<UICheckbox v-model="options.includes('b')" label="Option B" />
```

Correct:
```vue
<UICheckboxGroup v-model="selectedOptions">
  <UICheckboxGroupCheckbox value="a" label="Option A" />
  <UICheckboxGroupCheckbox value="b" label="Option B" />
</UICheckboxGroup>
```

UICheckbox is for a single boolean. Use UICheckboxGroup for selecting multiple values from a set.

### HIGH: Passing errorMessage without checking touched state

Wrong:
```vue
<UICheckbox
  v-model="field.modelValue.value"
  :error-message="field.errors.value?._errors?.[0]"
/>
```

Correct:
```vue
<UICheckbox
  v-model="field.modelValue.value"
  :error-message="field.isTouched.value ? field.errors.value?._errors?.[0] ?? null : null"
  @blur="field.setTouched()"
/>
```

### MEDIUM: Expecting v-model to be nullable

The v-model type is `boolean`, not `boolean | null`. It must always be `true` or `false`.

## Accessibility

- Reka UI CheckboxRoot handles: `role="checkbox"`, `aria-checked`, keyboard toggling (Space key)
- `useInput`-derived ARIA attributes are not used directly (no `useInput` call in checkbox), but InputWrapper handles error/hint associations
- `data-invalid` attribute applied when `errorMessage` is present, driving error border styles
- `disabled` attribute on the root prevents interaction and shows disabled-reason tooltip
- Keyboard: Space to toggle, Tab to navigate between checkboxes
- The animated check indicator SVGs have `aria-hidden="true"`

## See Also

- [input-system](../../foundations/input-system/SKILL.md) -- Inherited props and architecture
- [checkbox-group](../checkbox-group/SKILL.md) -- Multi-select checkbox group
- [switch](../switch/SKILL.md) -- Toggle for immediate on/off settings
