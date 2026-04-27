<script setup lang="ts">
import { ref } from 'vue'

import { UISelect } from '@/ui/select'
import { createSelectOptions } from '@/ui/select/select.type'

const props = withDefaults(defineProps<{
  isDisabled?: boolean
  isLoading?: boolean
  isReadonly?: boolean
  isRequired?: boolean
  errorMessage?: string
  label?: string
  placeholder?: string
  search?: 'local' | 'remote' | null
  size?: 'md' | 'sm'
}>(), {
  isDisabled: false,
  isLoading: false,
  isReadonly: false,
  isRequired: false,
  errorMessage: undefined,
  label: 'Fruits',
  placeholder: 'Select fruits...',
  search: null,
  size: 'md',
})

const items = createSelectOptions([
  'Apple',
  'Banana',
  'Cherry',
  'Mango',
  'Orange',
  'Strawberry',
])

const modelValue = ref<string[]>([])

function displayFn(value: string): string {
  return value
}
</script>

<template>
  <div class="p-xl">
    <UISelect
      v-model="modelValue"
      :display-fn="displayFn"
      :error-message="props.errorMessage"
      :is-disabled="props.isDisabled"
      :is-loading="props.isLoading"
      :is-readonly="props.isReadonly"
      :is-required="props.isRequired"
      :items="items"
      :label="props.label"
      :placeholder="props.placeholder"
      :search="props.search"
      :size="props.size"
      class="w-72"
    />
  </div>
</template>
