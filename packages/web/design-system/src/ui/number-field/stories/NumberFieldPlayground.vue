<script setup lang="ts">
import { ref } from 'vue'

import NumberField from '@/ui/number-field/NumberField.vue'

const props = withDefaults(defineProps<{
  isDisabled?: boolean
  isLoading?: boolean
  isReadonly?: boolean
  isRequired?: boolean
  errorMessage?: string
  hideErrorMessage?: boolean
  hint?: string
  label?: string
  max?: number
  min?: number
  placeholder?: string
  showControls?: boolean
  step?: number
}>(), {
  isDisabled: false,
  isLoading: false,
  isReadonly: false,
  isRequired: false,
  errorMessage: undefined,
  hideErrorMessage: false,
  hint: undefined,
  label: 'Number Field',
  max: undefined,
  min: undefined,
  placeholder: 'Enter a number',
  showControls: false,
  step: undefined,
})

const modelValue = ref<number | null>(null)
</script>

<template>
  <div>
    <NumberField
      v-model="modelValue"
      :error-message="props.errorMessage"
      :hide-error-message="props.hideErrorMessage"
      :hint="props.hint"
      :is-disabled="props.isDisabled"
      :is-loading="props.isLoading"
      :is-readonly="props.isReadonly"
      :is-required="props.isRequired"
      :label="props.label"
      :max="props.max"
      :min="props.min"
      :placeholder="props.placeholder"
      :show-controls="props.showControls"
      :step="props.step"
      class="w-72"
    />
  </div>
</template>
