<script setup lang="ts">
import {
  DatePickerCalendar as RekaDatePickerCalendar,
  DatePickerRoot as RekaDatePickerRoot,
} from 'reka-ui'
import { Temporal } from 'temporal-polyfill'
import {
  computed,
  toRef,
} from 'vue'

import { useDatePicker } from '@/composables/datePicker.composable'
import { useProvideDatePickerFieldContext } from '@/ui/date-field/datePickerField.context'
import { createDatePickerFieldStyle } from '@/ui/date-field/datePickerField.style'
import DatePickerCalendarGrid from '@/ui/date-field/DatePickerCalendarGrid.vue'
import DatePickerCalendarHeader from '@/ui/date-field/DatePickerCalendarHeader.vue'
import type { DatePickerProps } from '@/ui/date-picker/datePicker.props'
import ThemeProvider from '@/ui/theme-provider/ThemeProvider.vue'
import { getWeekStartsOn } from '@/utils/weekStartsOn.util'

const props = withDefaults(defineProps<DatePickerProps>(), {
  maxDate: null,
  minDate: null,
})

const modelValue = defineModel<Temporal.PlainDate | null>({
  required: true,
})

const {
  calendarPlaceholder,
  calendarValue,
  locale,
  maxDateValue,
  minDateValue,
  setPlaceholder,
} = useDatePicker({
  maxDate: toRef(props, 'maxDate'),
  minDate: toRef(props, 'minDate'),
  modelValue,
})

const datePickerStyle = computed(() => createDatePickerFieldStyle({
  size: 'md',
}))

useProvideDatePickerFieldContext({
  datePickerStyle,
  placeholder: calendarPlaceholder,
  setPlaceholder,
  onClose: () => {},
})
</script>

<template>
  <ThemeProvider>
    <RekaDatePickerRoot
      v-model="calendarValue"
      v-model:placeholder="calendarPlaceholder"
      :week-starts-on="getWeekStartsOn(locale)"
      :max-value="maxDateValue"
      :min-value="minDateValue"
      :locale="locale"
    >
      <RekaDatePickerCalendar
        v-slot="{ weekDays, grid }"
        :fixed-weeks="true"
        class="flex flex-col gap-lg overflow-hidden bg-primary p-2xl px-3xl"
        weekday-format="short"
      >
        <DatePickerCalendarHeader />

        <DatePickerCalendarGrid
          v-for="month in grid"
          :key="month.value.toString()"
          :month="month"
          :week-days="weekDays"
        />
      </RekaDatePickerCalendar>
    </RekaDatePickerRoot>
  </ThemeProvider>
</template>
