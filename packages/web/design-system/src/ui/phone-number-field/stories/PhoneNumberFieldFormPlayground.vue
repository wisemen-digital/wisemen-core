<script setup lang="ts">
import { ref } from 'vue'

import PhoneNumberField from '@/ui/phone-number-field/PhoneNumberField.vue'

const firstName = ref<string | null>(null)
const lastName = ref<string | null>(null)
const phone = ref<string | null>(null)
const submitted = ref<boolean>(false)
const submittedPhone = ref<string | null>(null)

function onSubmit(): void {
  submittedPhone.value = phone.value
  submitted.value = true
}

function onReset(): void {
  firstName.value = null
  lastName.value = null
  phone.value = null
  submitted.value = false
  submittedPhone.value = null
}
</script>

<template>
  <form
    class="flex max-w-sm flex-col gap-4"
    @submit.prevent="onSubmit"
    @reset.prevent="onReset"
  >
    <PhoneNumberField
      v-model="phone"
      :is-required="true"
      :preferred-country-codes="['BE', 'NL', 'FR', 'DE']"
      label="Phone number"
      hint="International format, e.g. +32 485 12 34 56"
    />

    <div class="flex gap-2">
      <button
        type="submit"
        class="rounded-md bg-fg-brand-primary px-md py-xs text-xs text-white"
      >
        Submit
      </button>
      <button
        type="reset"
        class="
          rounded-md border border-primary px-md py-xs text-xs text-secondary
        "
      >
        Reset
      </button>
    </div>

    <p
      v-if="submitted"
      class="text-xs text-primary"
    >
      Submitted: <strong>{{ submittedPhone ?? 'empty' }}</strong>
    </p>
  </form>
</template>
