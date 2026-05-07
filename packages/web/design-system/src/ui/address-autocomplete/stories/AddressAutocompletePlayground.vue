<script setup lang="ts">
import { ref } from 'vue'

import { UIAddressAutocomplete } from '@/ui/address-autocomplete'
import type { Address } from '@/ui/address-autocomplete/addressAutocomplete.type'

const props = withDefaults(defineProps<{
  isDisabled?: boolean
  isReadonly?: boolean
  isRequired?: boolean
  errorMessage?: string
  hideErrorMessage?: boolean
  hint?: string
  label?: string
  placeholder?: string
  size?: 'md' | 'sm'
}>(), {
  isDisabled: false,
  isReadonly: false,
  isRequired: false,
  errorMessage: undefined,
  hideErrorMessage: false,
  hint: undefined,
  label: 'Address',
  placeholder: 'Search an address...',
  size: 'md',
})

const modelValue = ref<Address | null>(null)
</script>

<template>
  <div class="flex gap-2 p-xl">
    <UIAddressAutocomplete
      v-model="modelValue"
      :error-message="props.errorMessage"
      :hide-error-message="props.hideErrorMessage"
      :hint="props.hint"
      :is-disabled="props.isDisabled"
      :is-readonly="props.isReadonly"
      :is-required="props.isRequired"
      :label="props.label"
      :placeholder="props.placeholder"
      :size="props.size"
      class="w-72"
    />
  </div>
</template>
