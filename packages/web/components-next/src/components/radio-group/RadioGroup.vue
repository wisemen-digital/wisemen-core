<script setup lang="ts" generic="TValue extends AcceptableValue">
import type { AcceptableValue } from 'reka-ui'
import { useId } from 'vue'

import FormField from '@/components/form-field/FormField.vue'
import RadioGroupRoot from '@/components/radio-group/parts/RadioGroupRoot.vue'
import type { RadioGroupEmits } from '@/components/radio-group/radioGroup.emits'
import type { RadioGroupProps } from '@/components/radio-group/radioGroup.props'

const props = defineProps<RadioGroupProps>()
const emit = defineEmits<RadioGroupEmits>()

const modelValue = defineModel<TValue>({
  required: true,
})

const id = props.id ?? useId()
</script>

<template>
  <FormField
    :error-message="props.errorMessage"
    :hint="props.hint"
    :is-required="props.isRequired"
    :is-touched="props.isTouched"
    :label="props.label"
    :for="id"
  >
    <template #label>
      <slot name="label" />
    </template>

    <template #error>
      <slot name="error" />
    </template>

    <template #hint>
      <slot name="hint" />
    </template>

    <RadioGroupRoot
      v-bind="props"
      :id="id"
      v-model="modelValue"
      @blur="emit('blur')"
    >
      <slot />
    </RadioGroupRoot>
  </FormField>
</template>
