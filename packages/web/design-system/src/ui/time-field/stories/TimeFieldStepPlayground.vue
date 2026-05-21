<script setup lang="ts">
import { Temporal } from 'temporal-polyfill'
import { ref } from 'vue'

import TimeField from '@/ui/time-field/TimeField.vue'

const step15Value = ref<Temporal.PlainTime | null>(Temporal.PlainTime.from('09:00'))
const step30Value = ref<Temporal.PlainTime | null>(Temporal.PlainTime.from('09:00'))
const stepSecondValue = ref<Temporal.PlainTime | null>(Temporal.PlainTime.from('09:00:00'))
</script>

<template>
  <div class="flex flex-wrap gap-4">
    <TimeField
      v-model="step15Value"
      :step="{ minute: 15 }"
      class="w-56"
      hint="Arrow keys increment by 15 minutes"
      label="15-minute steps"
    />

    <TimeField
      v-model="step30Value"
      :step="{ minute: 30 }"
      class="w-56"
      hint="Arrow keys increment by 30 minutes"
      label="30-minute steps"
    />

    <TimeField
      v-model="stepSecondValue"
      :step="{ second: 15 }"
      granularity="second"
      class="w-56"
      hint="Arrow keys increment seconds by 15"
      label="15-second steps"
    />
  </div>
</template>
