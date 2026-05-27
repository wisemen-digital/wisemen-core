---
name: switch
description: >
  A toggle switch for boolean on/off state with optional thumb icons, size
  variants, and animated transitions. Built on Reka UI SwitchRoot with label,
  hint, and error message support. Ideal for settings that take effect
  immediately.
type: component
library: vue-core-design-system
category: form-control
requires:
  - input-system
exports:
  - UISwitch
  - UISwitchProps
---

# UISwitch

A toggle switch for boolean on/off state with optional animated thumb icons and size variants.

## When to Use

- Settings or preferences that take effect immediately (enable dark mode, toggle notifications)
- Binary on/off controls where the visual metaphor of a physical switch is appropriate
- When you want animated icon transitions inside the thumb

**Use instead:** [UICheckbox](../checkbox/SKILL.md) for form fields that submit with a form (agree to terms), [UIRadioGroup](../radio-group/SKILL.md) for choosing between more than two options.

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

## API

### Props

> Inherits from: `Input`, `InputWrapper` (see [input-system](../../foundations/input-system/SKILL.md))
>
> Note: UISwitch does NOT inherit from `FieldWrapper`. It has its own switch track/thumb rendering.

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `iconChecked` | `Component \| null` | `null` | Icon component displayed inside the thumb when the switch is checked (on). |
| `iconUnchecked` | `Component \| null` | `null` | Icon component displayed inside the thumb when the switch is unchecked (off). |
| `size` | `'md' \| 'sm'` | `'md'` | The size of the switch. |

### v-model

| Model | Type | Required | Description |
|-------|------|----------|-------------|
| `modelValue` | `boolean` | Yes | Whether the switch is on (`true`) or off (`false`). |

### Slots

| Slot | Description |
|------|-------------|
| `left` | Content rendered to the left of the label text. |
| `right` | Content rendered to the right of the label text. |

### Emits

| Event | Payload | Description |
|-------|---------|-------------|
| `blur` | none | Emitted when the switch loses focus. |

## Variants

### Size

| Size | Track Dimensions |
|------|-----------------|
| `md` | `h-5 w-9` (20x36px) -- Default |
| `sm` | Smaller track (defined by style variants) |

## Examples

### Basic Usage

```vue
<script setup lang="ts">
import { ref } from 'vue'
import { UISwitch } from '@wisemen/vue-core-design-system'

const darkMode = ref<boolean>(false)
</script>

<template>
  <UISwitch
    v-model="darkMode"
    label="Dark mode"
    hint="Toggle between light and dark theme"
  />
</template>
```

### With Formango

```vue
<script setup lang="ts">
import { useForm } from '@wisemen/formango'
import { UISwitch } from '@wisemen/vue-core-design-system'
import { z } from 'zod'

const { form } = useForm({
  schema: z.object({
    emailNotifications: z.boolean(),
  }),
  onSubmit(values) {
    console.log(values)
  },
})

const emailNotifications = form.register('emailNotifications')
</script>

<template>
  <UISwitch
    v-model="emailNotifications.modelValue.value"
    :error-message="emailNotifications.isTouched.value ? emailNotifications.errors.value?._errors?.[0] ?? null : null"
    label="Email notifications"
    hint="Receive email alerts for important updates"
    @blur="emailNotifications.setTouched()"
  />
</template>
```

### With Icons

```vue
<script setup lang="ts">
import { ref } from 'vue'
import { CheckIcon, XCloseIcon } from '@wisemen/vue-core-icons'
import { UISwitch } from '@wisemen/vue-core-design-system'

const isActive = ref<boolean>(true)
</script>

<template>
  <UISwitch
    v-model="isActive"
    :icon-checked="CheckIcon"
    :icon-unchecked="XCloseIcon"
    label="Active"
  />
</template>
```

### Disabled with Reason

```vue
<script setup lang="ts">
import { ref } from 'vue'
import { UISwitch } from '@wisemen/vue-core-design-system'

const feature = ref<boolean>(false)
</script>

<template>
  <UISwitch
    v-model="feature"
    :is-disabled="true"
    disabled-reason="Upgrade to premium to enable this feature"
    label="Premium feature"
  />
</template>
```

### With Error

```vue
<script setup lang="ts">
import { ref } from 'vue'
import { UISwitch } from '@wisemen/vue-core-design-system'

const terms = ref<boolean>(false)
</script>

<template>
  <UISwitch
    v-model="terms"
    :is-required="true"
    :error-message="!terms ? 'You must enable this setting' : null"
    label="Accept terms"
  />
</template>
```

## Anatomy

```
ActionTooltip                    (shows disabledReason when disabled)
└── RowLayout
    ├── RekaSwitchRoot           (Reka UI switch, handles toggle state)
    │   └── RekaSwitchThumb      (sliding thumb)
    │       └── SwitchThumbIcon  (animated icon inside thumb)
    └── div
        ├── UIRowLayout
        │   ├── slot#left
        │   ├── UIText (label)   (as <label> element)
        │   └── slot#right
        ├── InputWrapperHint     (hint text)
        └── InputWrapperErrorMessage (error text)
```

Note: Unlike other input components, UISwitch does NOT use InputWrapper. It manually composes the label, hint, and error message. The switch track is on the left with the label and metadata on the right.

## Styling

**Style file:** `src/ui/switch/switch.style.ts`
**tv() slots:**
- `root` -- The switch track. Rounded pill shape with brand color when checked, tertiary when unchecked. Includes disabled, error, and dark mode states.
- `thumb` -- The sliding circle inside the track. White background with shadow, translates right when checked.
- `thumbIcon` -- The icon inside the thumb. Changes color based on checked state (gray when unchecked, brand when checked).

The thumb icon uses Motion (motion-v) with AnimatePresence for animated icon transitions -- icons slide in/out with blur and opacity effects.

## Common Mistakes

### CRITICAL: Using UISwitch for form submission fields

Wrong:
```vue
<!-- UISwitch for "I agree to terms" in a form -->
<UISwitch v-model="acceptTerms" label="I agree to terms" />
```

Correct:
```vue
<!-- Use UICheckbox for form agreement fields -->
<UICheckbox v-model="acceptTerms" label="I agree to terms" />
```

UISwitch is semantically for settings that take immediate effect. UICheckbox is better for form fields that submit with a form. Use UISwitch for toggles like "Enable dark mode" and UICheckbox for "I agree to terms."

### HIGH: Expecting v-model to be nullable

Wrong:
```vue
const value = ref<boolean | null>(null)
```

Correct:
```vue
const value = ref<boolean>(false)
```

The v-model type is `boolean`, not `boolean | null`. A switch is always either on or off.

### MEDIUM: Setting icons without both iconChecked and iconUnchecked

You can set just one icon (e.g., only `iconChecked`), but for the best UX, provide both so the thumb always has an icon. When only one is set, the thumb shows an empty circle in the other state, which may look inconsistent.

## Accessibility

- Reka UI SwitchRoot handles `role="switch"`, `aria-checked`
- Keyboard: Space key toggles the switch
- `data-invalid` attribute applied when `errorMessage` is present, driving error border/background
- Disabled state prevents interaction and shows disabled-reason tooltip
- Label is rendered as a `<label>` element associated with the switch
- `isLabelHidden` renders the label with `sr-only` for screen reader accessibility
- `isRequired` adds an asterisk to the label and `data-label-required` attribute

## See Also

- [input-system](../../foundations/input-system/SKILL.md) -- Inherited props and architecture
- [checkbox](../checkbox/SKILL.md) -- Boolean form field for submission
- [checkbox-group](../checkbox-group/SKILL.md) -- Multi-value selection
