<script setup lang="ts">
import { ref } from 'vue'

import type { TextareaFieldProps } from '@/ui/textarea-field/textareaField.props'
import TextareaField from '@/ui/textarea-field/TextareaField.vue'

const props = withDefaults(defineProps<{
  isDisabled?: boolean
  isReadonly?: boolean
  isRequired?: boolean
  isSpellCheckEnabled?: boolean
  errorMessage?: TextareaFieldProps['errorMessage']
  hideErrorMessage?: boolean
  hint?: TextareaFieldProps['hint']
  label?: string
  placeholder?: string
  resize?: TextareaFieldProps['resize']
}>(), {
  isDisabled: false,
  isReadonly: false,
  isRequired: false,
  isSpellCheckEnabled: false,
  errorMessage: undefined,
  hideErrorMessage: false,
  hint: undefined,
  label: 'Label',
  placeholder: 'Enter text...',
  resize: 'none',
})

const modelValue = ref<string | null>(null)
</script>

<template>
  <div>
    <TextareaField
      v-model="modelValue"
      :error-message="props.errorMessage"
      :hide-error-message="props.hideErrorMessage"
      :hint="props.hint"
      :is-disabled="props.isDisabled"
      :is-readonly="props.isReadonly"
      :is-required="props.isRequired"
      :is-spell-check-enabled="props.isSpellCheckEnabled"
      :label="props.label"
      :placeholder="props.placeholder"
      :resize="props.resize"
      class="w-72"
    />
  </div>
</template>
