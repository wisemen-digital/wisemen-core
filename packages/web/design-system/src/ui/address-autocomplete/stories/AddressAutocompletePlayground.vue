<script setup lang="ts">
import { ref } from 'vue'

import { UIAddressAutocomplete } from '@/ui/address-autocomplete'
import type { Address } from '@/ui/address-autocomplete/addressAutocomplete.type'
import {
  UIFormFieldGrid,
  UIFormFieldGroup,
} from '@/ui/field'
import { UITextField } from '@/ui/text-field'

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
  <div
    v-if="false"
    class="flex gap-2 p-xl"
  >
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

  <div class="flex w-100 flex-col gap-2 p-xl">
    <UIFormFieldGroup>
      <UIFormFieldGrid
        :lg="2"
        :sm="2"
      >
        <UITextField
          :is-readonly="true"
          model-value="Steve"
          label="First name"
          placeholder="First name"
        />
        <UITextField
          :is-readonly="true"
          model-value="The Boss"
          label="Last name"
          placeholder="Street"
        />
      </UIFormFieldGrid>

      <UIFormFieldGrid
        :lg="1"
        :sm="1"
      >
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
        />
      </UIFormFieldGrid>
    </UIFormFieldGroup>
  </div>
</template>
