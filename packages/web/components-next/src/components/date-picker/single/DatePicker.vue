<script setup lang="ts">
import type { Temporal } from 'temporal-polyfill'

import type { DatePickerProps } from '@/components/date-picker/single/datePicker.props'
import DatePickerDate from '@/components/date-picker/single/parts/DatePickerDate.vue'
import DatePickerGrid from '@/components/date-picker/single/parts/DatePickerGrid.vue'
import DatePickerHeader from '@/components/date-picker/single/parts/DatePickerHeader.vue'
import DatePickerRoot from '@/components/date-picker/single/parts/DatePickerRoot.vue'

const props = defineProps<DatePickerProps>()

const modelValue = defineModel<Temporal.PlainDate | null>({
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
  <DatePickerRoot
    v-slot="{ grid, weekDays }"
    v-bind="props"
    v-model="modelValue"
    v-model:placeholder-value="placeholderValue"
  >
    <DatePickerHeader :grid="grid" />
    <DatePickerGrid
      :week-days="weekDays"
      :grid="grid"
    >
      <template #date="{ date }">
        <slot
          :date="date"
          name="date"
        >
          <DatePickerDate />
        </slot>
      </template>
    </DatePickerGrid>
  </DatePickerRoot>
</template>
