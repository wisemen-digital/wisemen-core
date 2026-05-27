<script setup lang="ts">
import { Temporal } from 'temporal-polyfill'
import { ref } from 'vue'

import TimeField from '@/ui/time-field/TimeField.vue'

const emptyValue = ref<Temporal.PlainTime | null>(null)
const filledValue = ref<Temporal.PlainTime | null>(Temporal.PlainTime.from('09:30'))
const disabledValue = ref<Temporal.PlainTime | null>(Temporal.PlainTime.from('14:00'))
const readonlyValue = ref<Temporal.PlainTime | null>(Temporal.PlainTime.from('08:00'))
const loadingValue = ref<Temporal.PlainTime | null>(null)
const errorValue = ref<Temporal.PlainTime | null>(null)
</script>

<template>
  <div class="flex flex-wrap gap-4">
    <TimeField
      v-model="emptyValue"
      class="w-56"
      label="Default"
    />

    <TimeField
      v-model="filledValue"
      class="w-56"
      label="Filled"
    />

    <TimeField
      v-model="disabledValue"
      :is-disabled="true"
      class="w-56"
      disabled-reason="You don't have permission to edit this field"
      label="Disabled"
    />

    <TimeField
      v-model="readonlyValue"
      :is-readonly="true"
      class="w-56"
      label="Read Only"
    />

    <TimeField
      v-model="loadingValue"
      :is-loading="true"
      class="w-56"
      label="Loading"
    />

    <TimeField
      v-model="errorValue"
      class="w-56"
      error-message="Please enter a valid time."
      label="Error"
    />
  </div>
</template>
