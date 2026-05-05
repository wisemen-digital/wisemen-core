<script setup lang="ts">
import { ref } from 'vue'

import type { InlineTextFieldProps } from '@/ui/inline-text-field/inlineTextField.props'
import InlineTextField from '@/ui/inline-text-field/InlineTextField.vue'

const props = withDefaults(defineProps<{
  isDisabled?: boolean
  isLoading?: boolean
  isReadonly?: boolean
  isRequired?: boolean
  errorMessage?: InlineTextFieldProps['errorMessage']
  label?: string
  placeholder?: string
  size?: InlineTextFieldProps['size']
  type?: InlineTextFieldProps['type']
  variant?: InlineTextFieldProps['variant']
}>(), {
  isDisabled: false,
  isLoading: false,
  isReadonly: false,
  isRequired: false,
  errorMessage: undefined,
  label: 'First name',
  placeholder: 'Enter text...',
  size: 'md',
  type: 'text',
  variant: 'primary',
})

const modelValue = ref<string | null>(null)
</script>

<template>
  <div class="p-8">
    <InlineTextField
      v-model="modelValue"
      :error-message="props.errorMessage"
      :variant="props.variant"
      :is-disabled="props.isDisabled"
      :is-loading="props.isLoading"
      :is-readonly="props.isReadonly"
      :is-required="props.isRequired"
      :label="props.label"
      :placeholder="props.placeholder"
      :size="props.size"
      :type="props.type"
    />
  </div>
</template>
