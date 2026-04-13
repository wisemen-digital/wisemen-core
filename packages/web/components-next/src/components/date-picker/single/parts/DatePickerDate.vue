<script setup lang="ts">
import { CalendarCellTrigger as RekaCalendarCellTrigger } from 'reka-ui'

import { mergeClasses } from '@/class-variant/customClassVariants'
import { useInjectDatePickerDateContext } from '@/components/date-picker/shared/datePickerDate.context'
import { useInjectDatePickerContext } from '@/components/date-picker/single/datePicker.context'

const {
  classConfig,
  customClassConfig,
  style,
} = useInjectDatePickerContext()

const {
  date, month,
} = useInjectDatePickerDateContext()
</script>

<template>
  <RekaCalendarCellTrigger
    v-slot="{ today }"
    :day="date"
    :month="month"
    :class="style.date({
      class: mergeClasses(customClassConfig.date, classConfig?.date),
    })"
  >
    <slot :day="date.day">
      {{ date.day }}
    </slot>

    <div
      v-if="today"
      :class="style.todayIndicator({
        class: mergeClasses(customClassConfig.todayIndicator, classConfig?.todayIndicator),
      })"
    />
  </RekaCalendarCellTrigger>
</template>
