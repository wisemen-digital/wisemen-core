---
name: form-field-usage
description: >
  VcFormField wrapping pattern with compound parts (VcFormFieldRoot,
  VcFormFieldLabel, VcFormFieldError, VcFormFieldHint), binding form
  inputs (VcTextField, VcSelect, VcDateField, VcCheckbox, etc.) to
  formango with the toFormField helper, VcFormField layout prop for
  horizontal labels. Use when building validated forms with
  @wisemen/vue-core-components and formango.
type: core
library: vue-core-components
library_version: "3.0.1"
requires:
  - config-setup
sources:
  - "wisemen-digital/wisemen-core:packages/web/components-next/src/components/form-field/index.ts"
  - "wisemen-digital/wisemen-core:packages/web/components-next/src/components/text-field/index.ts"
  - "wisemen-digital/wisemen-core:packages/web/components-next/src/components/select/index.ts"
---

# @wisemen/vue-core-components — Form Field Usage

## Setup

```vue
<script setup lang="ts">
import { useForm } from 'formango'
import type { Field } from 'formango'
import { formatErrorsToZodFormattedError } from 'formango'
import {
  VcFormField,
  VcTextField,
  VcSelect,
  VcSelectItem,
  VcCheckbox,
} from '@wisemen/vue-core-components'
import { z } from 'zod'

const schema = z.object({
  name: z.string().min(1),
  email: z.string().email(),
  country: z.string(),
  agreedToTerms: z.boolean().refine((v) => v, 'You must agree'),
})

const form = useForm({
  schema,
  initialState: { name: '', email: '', country: '', agreedToTerms: false },
  onSubmit: async (data) => {
    await ContactService.create(data)
  },
})

const name = form.register('name')
const email = form.register('email')
const country = form.register('country')
const agreedToTerms = form.register('agreedToTerms')

function toFormField<TValue, TDefaultValue>(field: Field<TValue, TDefaultValue>) {
  return {
    'isTouched': field.isTouched.value,
    'errors': formatErrorsToZodFormattedError(field.errors.value),
    'modelValue': field.modelValue.value,
    'onBlur': field.onBlur,
    'onUpdate:modelValue': field['onUpdate:modelValue'],
  }
}
</script>

<template>
  <form @submit.prevent="form.submit">
    <VcFormField for="name" label="Full name">
      <VcTextField v-bind="toFormField(name)" placeholder="Enter name" />
    </VcFormField>

    <VcFormField for="email" label="Email address">
      <VcTextField v-bind="toFormField(email)" type="email" />
      <template #hint>We'll never share your email</template>
    </VcFormField>

    <VcFormField for="country" label="Country">
      <VcSelect
        v-bind="toFormField(country)"
        :display-fn="(c: string) => c"
        placeholder="Choose country"
      >
        <VcSelectItem value="Belgium">Belgium</VcSelectItem>
        <VcSelectItem value="Netherlands">Netherlands</VcSelectItem>
      </VcSelect>
    </VcFormField>

    <VcCheckbox v-bind="toFormField(agreedToTerms)">
      I agree to the terms and conditions
    </VcCheckbox>

    <button type="submit" :disabled="form.isSubmitting.value">Submit</button>
  </form>
</template>
```

VcFormField wraps any input with a label, error message, and hint. The `toFormField` helper bridges formango's `Field` type to the component props — it extracts `modelValue`, the update handler, `onBlur`, touch state, and validation errors.

## Core Patterns

### VcFormField compound parts

For custom layouts, use the individual parts instead of the convenience wrapper:

```vue
<VcFormFieldRoot for="bio">
  <VcFormFieldLabel>Biography</VcFormFieldLabel>
  <VcTextarea v-bind="toFormField(bio)" placeholder="Tell us about yourself" />
  <VcFormFieldError v-if="bio.errors.value">
    {{ formatErrorsToZodFormattedError(bio.errors.value)?._errors?.[0] }}
  </VcFormFieldError>
  <VcFormFieldHint>Maximum 500 characters</VcFormFieldHint>
</VcFormFieldRoot>
```

### Horizontal label layout

```vue
<VcFormField for="status" label="Status" layout="horizontal">
  <VcSelect v-bind="toFormField(status)" :display-fn="(s: string) => s">
    <VcSelectItem value="active">Active</VcSelectItem>
    <VcSelectItem value="inactive">Inactive</VcSelectItem>
  </VcSelect>
</VcFormField>
```

With `layout="horizontal"`, the label renders beside the input instead of above it.

### Available form inputs

All inputs share common props: `isDisabled`, `isRequired`, `isLoading`, `placeholder`, `iconLeft`, `iconRight`, `variant`, `classConfig`.

```vue
<!-- Text inputs -->
<VcTextField v-model="value" type="text" />
<VcTextField v-model="value" type="email" icon-left="search" />
<VcPasswordField v-model="password" />
<VcTextarea v-model="bio" />
<VcNumberField v-model="quantity" :min="0" :max="100" :step="1" />
<VcPhoneNumberField v-model="phone" />

<!-- Date/time inputs (uses temporal-polyfill internally) -->
<VcDateField v-model="date" />
<VcDateRangeField v-model="dateRange" />
<VcTimeField v-model="time" />

<!-- Selection inputs -->
<VcSelect v-model="selected" :display-fn="displayFn" :items="items" />
<VcAutocomplete v-model="selected" :display-fn="displayFn" :items="items" />

<!-- Toggle inputs -->
<VcCheckbox v-model="checked">Label</VcCheckbox>
<VcSwitch v-model="enabled" />
<VcRadioGroup v-model="choice">
  <VcRadioGroupItem value="a">Option A</VcRadioGroupItem>
  <VcRadioGroupItem value="b">Option B</VcRadioGroupItem>
</VcRadioGroup>
```

### VcSelect requires displayFn

VcSelect and VcAutocomplete always require a `displayFn` prop that converts any value to a display string:

```vue
<VcSelect
  v-bind="toFormField(selectedUser)"
  :display-fn="(user: User) => user.name"
  placeholder="Choose user"
>
  <VcSelectItem v-for="user in users" :key="user.uuid" :value="user">
    {{ user.name }}
  </VcSelectItem>
</VcSelect>
```

## Common Mistakes

### CRITICAL: Not wrapping inputs in VcFormField

```vue
<!-- No label, no error display, no hint — just a raw input -->
<VcTextField v-bind="toFormField(email)" type="email" />
```

```vue
<VcFormField for="email" label="Email">
  <VcTextField v-bind="toFormField(email)" type="email" />
</VcFormField>
```

Without VcFormField, there is no visible label (accessibility violation), no error message display (validation errors are invisible), and no hint. Every form input in production should be wrapped in VcFormField.

Source: `src/components/form-field/VcFormField.vue` — renders `<label>`, error, and hint elements around the slot content.

### HIGH: Binding formango fields incorrectly

```vue
<!-- Breaks two-way binding — accesses the ComputedRef object itself, not its value -->
<VcTextField
  :model-value="email.modelValue"
  @update:model-value="(v) => { email.modelValue = v }"
/>
```

```vue
<!-- toFormField extracts .value from all refs and binds the correct handlers -->
<VcTextField v-bind="toFormField(email)" />
```

Formango field properties (`modelValue`, `errors`, `isDirty`, `isTouched`) are `ComputedRef` or `Ref` objects. The `toFormField` helper extracts `.value` from each and binds the correct `onUpdate:modelValue` and `onBlur` handlers. Without it, you'd need to manually unwrap every ref and bind every handler.

Source: formango `Field` interface — all properties are refs, not plain values.

### HIGH: Forgetting displayFn on VcSelect

```vue
<!-- Runtime error: displayFn is a required prop -->
<VcSelect v-bind="toFormField(country)">
  <VcSelectItem value="BE">Belgium</VcSelectItem>
</VcSelect>
```

```vue
<VcSelect v-bind="toFormField(country)" :display-fn="(v: string) => v">
  <VcSelectItem value="BE">Belgium</VcSelectItem>
</VcSelect>
```

`displayFn` is required because VcSelect needs to render the selected value in the trigger (closed state). It's also used for client-side filtering when `filter` is enabled. Without it, the component errors.

Source: `src/components/select/VcSelect.vue` — `displayFn` is a required prop with no default.

## See Also

- [config-setup](../config-setup/SKILL.md) — VcConfigProvider required before using components
- [dialog-toast-usage](../dialog-toast-usage/SKILL.md) — feedback after form submission
- [table-usage](../table-usage/SKILL.md) — tables for displaying form-created data
