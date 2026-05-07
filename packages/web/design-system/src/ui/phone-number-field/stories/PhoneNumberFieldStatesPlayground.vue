<script setup lang="ts">
import { ref } from 'vue'

import PhoneNumberField from '@/ui/phone-number-field/PhoneNumberField.vue'

const emptyValue = ref<string | null>(null)
const filledValue = ref<string | null>('+32 485 12 34 56')
const disabledValue = ref<string | null>('+32 485 12 34 56')
const readonlyValue = ref<string | null>('+32 485 12 34 56')
const loadingValue = ref<string | null>(null)
const errorValue = ref<string | null>(null)
const preferredValue = ref<string | null>(null)
</script>

<template>
  <div class="flex flex-wrap gap-4">
    <PhoneNumberField
      v-model="emptyValue"
      class="w-72"
      label="Default"
    />

    <PhoneNumberField
      v-model="filledValue"
      class="w-72"
      label="Filled"
    />

    <PhoneNumberField
      v-model="disabledValue"
      :is-disabled="true"
      class="w-72"
      label="Disabled"
      disabled-reason="You don't have permission to edit this field"
    />

    <PhoneNumberField
      v-model="readonlyValue"
      :is-readonly="true"
      class="w-72"
      label="Read Only"
    />

    <PhoneNumberField
      v-model="loadingValue"
      :is-loading="true"
      class="w-72"
      label="Loading"
    />

    <PhoneNumberField
      v-model="errorValue"
      class="w-72"
      error-message="Please enter a valid phone number"
      label="Error"
    />

    <PhoneNumberField
      v-model="preferredValue"
      :preferred-country-codes="['BE', 'NL', 'FR', 'DE']"
      class="w-72"
      label="With preferred countries"
      hint="BE, NL, FR, DE pinned at top"
    />
  </div>
</template>
