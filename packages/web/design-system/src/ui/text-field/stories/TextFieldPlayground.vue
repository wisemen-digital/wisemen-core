<script setup lang="ts">
import { ref } from 'vue'

import type { TextFieldProps } from '@/ui/text-field/textField.props'
import TextField from '@/ui/text-field/TextField.vue'

const props = withDefaults(defineProps<{
  isDisabled?: boolean
  isLoading?: boolean
  isReadonly?: boolean
  isRequired?: boolean
  errorMessage?: TextFieldProps['errorMessage']
  hideErrorMessage?: boolean
  hint?: TextFieldProps['hint']
  label?: string
  placeholder?: string
  size?: TextFieldProps['size']
  type?: TextFieldProps['type']
}>(), {
  isDisabled: false,
  isLoading: false,
  isReadonly: false,
  isRequired: false,
  errorMessage: undefined,
  hideErrorMessage: false,
  hint: undefined,
  label: 'Label',
  placeholder: 'Enter text...',
  size: 'md',
  type: 'text',
})

const modelValue = ref<string | null>(null)
</script>

<template>
  <div>
    <TextField
      v-model="modelValue"
      :error-message="props.errorMessage"
      :hide-error-message="props.hideErrorMessage"
      :hint="props.hint"
      :is-disabled="props.isDisabled"
      :is-loading="props.isLoading"
      :is-readonly="props.isReadonly"
      :is-required="props.isRequired"
      :label="props.label"
      :placeholder="props.placeholder"
      :size="props.size"
      :type="props.type"
      class="w-72"
    />
  </div>
</template>
