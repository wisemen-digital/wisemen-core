<script setup lang="ts">
import type { Temporal } from 'temporal-polyfill'

import type { DateRangePickerProps } from '@/components/date-picker/range/dateRangePicker.props'
import DateRangePickerDate from '@/components/date-picker/range/parts/DateRangePickerDate.vue'
import DateRangePickerGrid from '@/components/date-picker/range/parts/DateRangePickerGrid.vue'
import DateRangePickerHeader from '@/components/date-picker/range/parts/DateRangePickerHeader.vue'
import DateRangePickerRoot from '@/components/date-picker/range/parts/DateRangePickerRoot.vue'
import type { DateRange } from '@/types/dateRange.type'

const props = defineProps<DateRangePickerProps>()

const modelValue = defineModel<DateRange<Temporal.PlainDate>>({
  required: true,
})

/**
 * The placeholder date, which is used to determine what month to display when no date is selected.
 * This updates as the user navigates the calendar and can be used to programmatically control the calendar view
 */
const placeholderValue = defineModel<Temporal.PlainDate>('placeholderValue', {
  required: false,
})
</script>

<template>
  <DateRangePickerRoot
    v-slot="{ grid, weekDays }"
    v-bind="props"
    v-model="modelValue"
    v-model:placeholder-value="placeholderValue"
  >
    <DateRangePickerHeader :grid="grid" />
    <DateRangePickerGrid
      :week-days="weekDays"
      :grid="grid"
    >
      <template #date="{ date }">
        <slot
          :date="date"
          name="date"
        >
          <DateRangePickerDate />
        </slot>
      </template>
    </DateRangePickerGrid>
  </DateRangePickerRoot>
</template>
