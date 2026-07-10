<script setup lang="ts">
import type { PlainDateRange } from '@wisemen/vue-core-dates'
import type { Temporal } from 'temporal-polyfill'
import { ref } from 'vue'

import DateRangePicker from '@/ui/date-range-picker/DateRangePicker.vue'

const props = withDefaults(defineProps<{
  maxDate?: Temporal.PlainDate | null
  minDate?: Temporal.PlainDate | null
  hasPresets?: boolean
}>(), {
  maxDate: null,
  minDate: null,
  hasPresets: true,
})

const modelValue = ref<PlainDateRange>({
  from: null,
  until: null,
})
</script>

<template>
  <div class="flex flex-col gap-md">
    <div
      class="overflow-hidden rounded-2xl border border-secondary shadow-lg"
    >
      <DateRangePicker
        v-model="modelValue"
        :min-date="props.minDate ?? null"
        :max-date="props.maxDate ?? null"
        :has-presets="props.hasPresets"
      />
    </div>
  </div>
</template>
