<script setup lang="ts">
import { getLocalTimeZone } from '@internationalized/date'
import { RangeCalendarCellTrigger as RekaRangeCalendarCellTrigger } from 'reka-ui'
import { computed } from 'vue'

import { mergeClasses } from '@/class-variant/customClassVariants'
import { useInjectConfigContext } from '@/components/config-provider/config.context'
import { useInjectDateRangePickerContext } from '@/components/date-picker/range/dateRangePicker.context'
import { getDaysInMonth } from '@/components/date-picker/shared/datePicker.util'
import { useInjectDatePickerDateContext } from '@/components/date-picker/shared/datePickerDate.context'

const {
  locale,
} = useInjectConfigContext()

const {
  classConfig,
  customClassConfig,
  style,
} = useInjectDateRangePickerContext()

const {
  date, month,
} = useInjectDatePickerDateContext()

const firstDayIndex = computed<number>(() => {
  const localeInfo = new Intl.Locale(locale.value)

  if ('weekInfo' in localeInfo) {
    return (localeInfo.weekInfo as { firstDay: number }).firstDay
  }

  return 1
})
</script>

<template>
  <RekaRangeCalendarCellTrigger
    v-slot="{ today }"
    :day="date"
    :month="month"
    :class="style.date({
      class: mergeClasses(customClassConfig.date, classConfig?.date),
    })"
    :data-first-day-of-week="date.toDate(getLocalTimeZone()).getDay() === firstDayIndex % 7 || undefined"
    :data-last-day-of-week="date.toDate(getLocalTimeZone()).getDay() === (firstDayIndex + 6) % 7 || undefined"
    :data-first-day-of-month="date.day === 1 || undefined"
    :data-last-day-of-month="date.day === getDaysInMonth(date.month, date.year) || undefined"
  >
    <div
      :class="style.innerDate({
        class: mergeClasses(customClassConfig.innerDate, classConfig?.innerDate),
      })"
    >
      <slot :day="date.day">
        {{ date.day }}
      </slot>
    </div>

    <div
      v-if="today"
      :class="style.todayIndicator({
        class: mergeClasses(customClassConfig.todayIndicator, classConfig?.todayIndicator),
      })"
    />
  </RekaRangeCalendarCellTrigger>
</template>
