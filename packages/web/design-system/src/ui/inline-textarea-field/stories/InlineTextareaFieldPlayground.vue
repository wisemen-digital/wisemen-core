<script setup lang="ts">
import { ref } from 'vue'

import type { InlineTextareaFieldProps } from '@/ui/inline-textarea-field/inlineTextareaField.props'
import InlineTextareaField from '@/ui/inline-textarea-field/InlineTextareaField.vue'

const props = withDefaults(defineProps<{
  isDisabled?: boolean
  isReadonly?: boolean
  isRequired?: boolean
  errorMessage?: InlineTextareaFieldProps['errorMessage']
  label?: string
  placeholder?: string
  resize?: InlineTextareaFieldProps['resize']
  size?: InlineTextareaFieldProps['size']
  variant?: InlineTextareaFieldProps['variant']
}>(), {
  isDisabled: false,
  isReadonly: false,
  isRequired: false,
  errorMessage: undefined,
  label: 'Notes',
  placeholder: 'Enter text...',
  resize: 'none',
  size: 'md',
  variant: 'primary',
})

const modelValue = ref<string | null>(null)
</script>

<template>
  <div class="p-8">
    <InlineTextareaField
      v-model="modelValue"
      :error-message="props.errorMessage"
      :variant="props.variant"
      :is-disabled="props.isDisabled"
      :is-readonly="props.isReadonly"
      :is-required="props.isRequired"
      :label="props.label"
      :placeholder="props.placeholder"
      :resize="props.resize"
      :size="props.size"
    />
  </div>
</template>
