<script setup lang="ts">
import { ref } from 'vue'

import { UIAutocomplete } from '@/ui/autocomplete'
import { createAutocompleteOptions } from '@/ui/autocomplete/autocomplete.type'

const props = withDefaults(defineProps<{
  isDisabled?: boolean
  isLoading?: boolean
  isReadonly?: boolean
  isRequired?: boolean
  errorMessage?: string
  hideErrorMessage?: boolean
  hint?: string
  label?: string
  placeholder?: string
  search?: 'local' | 'remote'
  size?: 'md' | 'sm'
}>(), {
  isDisabled: false,
  isLoading: false,
  isReadonly: false,
  isRequired: false,
  errorMessage: undefined,
  hideErrorMessage: false,
  hint: undefined,
  label: 'Label',
  placeholder: 'Search...',
  search: 'local',
  size: 'md',
})

const items = createAutocompleteOptions([
  'Apple',
  'Banana',
  'Cherry',
  'Mango',
  'Orange',
  'Strawberry',
])

const modelValue = ref<string | null>(null)

function displayFn(value: string): string {
  return value
}
</script>

<template>
  <div class="flex gap-2 p-xl">
    <UIAutocomplete
      v-model="modelValue"
      :display-fn="displayFn"
      :error-message="props.errorMessage"
      :hide-error-message="props.hideErrorMessage"
      :hint="props.hint"
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
