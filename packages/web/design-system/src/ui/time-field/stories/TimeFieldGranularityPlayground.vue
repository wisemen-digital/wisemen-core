<script setup lang="ts">
import { Temporal } from 'temporal-polyfill'
import { ref } from 'vue'

import TimeField from '@/ui/time-field/TimeField.vue'

const hourValue = ref<Temporal.PlainTime | null>(Temporal.PlainTime.from('14:30:45'))
const minuteValue = ref<Temporal.PlainTime | null>(Temporal.PlainTime.from('14:30:45'))
const secondValue = ref<Temporal.PlainTime | null>(Temporal.PlainTime.from('14:30:45'))
</script>

<template>
  <div class="flex flex-wrap gap-4">
    <TimeField
      v-model="hourValue"
      granularity="hour"
      class="w-56"
      hint="Shows hours only"
      label="Hour"
    />

    <TimeField
      v-model="minuteValue"
      granularity="minute"
      class="w-56"
      hint="Shows hours and minutes (default)"
      label="Minute"
    />

    <TimeField
      v-model="secondValue"
      granularity="second"
      class="w-56"
      hint="Shows hours, minutes, and seconds"
      label="Second"
    />
  </div>
</template>
