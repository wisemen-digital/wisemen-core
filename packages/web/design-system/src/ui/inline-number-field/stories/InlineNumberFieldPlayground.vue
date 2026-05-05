<script setup lang="ts">
import { ref } from 'vue'

import type { InlineNumberFieldProps } from '@/ui/inline-number-field/inlineNumberField.props'
import InlineNumberField from '@/ui/inline-number-field/InlineNumberField.vue'

const props = withDefaults(defineProps<{
  isDisabled?: boolean
  isLoading?: boolean
  isReadonly?: boolean
  isRequired?: boolean
  errorMessage?: InlineNumberFieldProps['errorMessage']
  label?: string
  max?: number | null
  min?: number | null
  placeholder?: string
  size?: InlineNumberFieldProps['size']
  step?: number
  variant?: InlineNumberFieldProps['variant']
}>(), {
  isDisabled: false,
  isLoading: false,
  isReadonly: false,
  isRequired: false,
  errorMessage: undefined,
  label: 'Quantity',
  max: null,
  min: null,
  placeholder: '0',
  size: 'md',
  step: 1,
  variant: 'primary',
})

const modelValue = ref<number | null>(null)
</script>

<template>
  <div class="p-8">
    <InlineNumberField
      v-model="modelValue"
      :error-message="props.errorMessage"
      :variant="props.variant"
      :is-disabled="props.isDisabled"
      :is-loading="props.isLoading"
      :is-readonly="props.isReadonly"
      :is-required="props.isRequired"
      :label="props.label"
      :max="props.max"
      :min="props.min"
      :placeholder="props.placeholder"
      :size="props.size"
      :step="props.step"
    />
  </div>
</template>
