<script setup lang="ts">
import type { CountryCode } from 'libphonenumber-js'
import { ref } from 'vue'

import type { PhoneNumberFieldProps } from '@/ui/phone-number-field/phoneNumberField.props'
import PhoneNumberField from '@/ui/phone-number-field/PhoneNumberField.vue'

const props = withDefaults(defineProps<{
  isDisabled?: boolean
  isLoading?: boolean
  isReadonly?: boolean
  isRequired?: boolean
  defaultCountryCode?: CountryCode
  errorMessage?: PhoneNumberFieldProps['errorMessage']
  hideErrorMessage?: boolean
  hint?: PhoneNumberFieldProps['hint']
  label?: string
  preferredCountryCodes?: CountryCode[]
  size?: PhoneNumberFieldProps['size']
}>(), {
  isDisabled: false,
  isLoading: false,
  isReadonly: false,
  isRequired: false,
  defaultCountryCode: 'BE',
  errorMessage: undefined,
  hideErrorMessage: false,
  hint: undefined,
  label: 'Phone number',
  preferredCountryCodes: () => [],
  size: 'md',
})

const modelValue = ref<string | null>(null)
</script>

<template>
  <div>
    <PhoneNumberField
      v-model="modelValue"
      :default-country-code="props.defaultCountryCode"
      :error-message="props.errorMessage"
      :hide-error-message="props.hideErrorMessage"
      :hint="props.hint"
      :is-disabled="props.isDisabled"
      :is-loading="props.isLoading"
      :is-readonly="props.isReadonly"
      :is-required="props.isRequired"
      :label="props.label"
      :preferred-country-codes="props.preferredCountryCodes"
      :size="props.size"
      class="w-72"
    />
  </div>
</template>
