<script setup lang="ts">
import type { Temporal } from 'temporal-polyfill'
import { ref } from 'vue'

import type { DateRangePickerRange } from '@/ui/date-range-picker/DateRangePicker.vue'
import DateRangePicker from '@/ui/date-range-picker/DateRangePicker.vue'

const props = withDefaults(defineProps<{
  maxDate?: Temporal.PlainDate | null
  minDate?: Temporal.PlainDate | null
  showPresets?: boolean
}>(), {
  maxDate: null,
  minDate: null,
  showPresets: true,
})

const modelValue = ref<DateRangePickerRange | null>(null)
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
        :show-presets="props.showPresets"
      />
    </div>
    <p class="text-sm text-secondary">
      Start: {{ modelValue?.start?.toString() ?? 'None' }} —
      End: {{ modelValue?.end?.toString() ?? 'None' }}
    </p>
  </div>
</template>
