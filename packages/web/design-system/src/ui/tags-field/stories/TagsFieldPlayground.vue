<script setup lang="ts">
import { ref } from 'vue'

import { UIFormFieldGrid } from '@/ui/field'
import type { TagsFieldProps } from '@/ui/tags-field/tagsField.props'
import TagsField from '@/ui/tags-field/TagsField.vue'
import { UITextField } from '@/ui/text-field'

const props = withDefaults(defineProps<{
  isDisabled?: boolean
  isLoading?: boolean
  isReadonly?: boolean
  isRequired?: boolean
  addOnPaste?: boolean
  allowDuplicate?: boolean
  delimiter?: string
  errorMessage?: TagsFieldProps['errorMessage']
  hideErrorMessage?: boolean
  hint?: TagsFieldProps['hint']
  label?: string
  max?: TagsFieldProps['max']
  placeholder?: string
  size?: TagsFieldProps['size']
}>(), {
  isDisabled: false,
  isLoading: false,
  isReadonly: false,
  isRequired: false,
  addOnPaste: true,
  allowDuplicate: false,
  delimiter: ',',
  errorMessage: undefined,
  hideErrorMessage: false,
  hint: undefined,
  label: 'Tags',
  max: null,
  placeholder: 'Add a tag...',
  size: 'md',
})

const modelValue = ref<string[]>([])
</script>

<template>
  <UIFormFieldGrid
    :lg="2"
    :sm="2"
    class="max-w-150"
  >
    <UITextField
      :model-value="null"
      placeholder="Add text here..."
      label="Example text field"
    />
    <TagsField
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
      :max="props.max"
      :allow-duplicate="props.allowDuplicate"
      :add-on-paste="props.addOnPaste"
      :delimiter="props.delimiter"
    />
  </UIFormFieldGrid>
</template>
