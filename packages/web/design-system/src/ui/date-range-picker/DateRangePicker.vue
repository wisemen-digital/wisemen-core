<script setup lang="ts">
import {
  DateRangePickerCalendar as RekaDateRangePickerCalendar,
  DateRangePickerRoot as RekaDateRangePickerRoot,
} from 'reka-ui'
import type { Temporal } from 'temporal-polyfill'
import { toRef } from 'vue'

import { useDateRangePicker } from '@/composables/dateRangePicker.composable'
import { useProvideDateRangeFieldContext } from '@/ui/date-range-field/dateRangeField.context'
import DateRangeFieldCalendarGrid from '@/ui/date-range-field/DateRangeFieldCalendarGrid.vue'
import DateRangeFieldCalendarHeader from '@/ui/date-range-field/DateRangeFieldCalendarHeader.vue'
import DateRangeFieldPresets from '@/ui/date-range-field/DateRangeFieldPresets.vue'
import type { DateRangePickerProps } from '@/ui/date-range-picker/dateRangePicker.props'
import ThemeProvider from '@/ui/theme-provider/ThemeProvider.vue'
import { getWeekStartsOn } from '@/utils/weekStartsOn.util'

defineOptions({
  inheritAttrs: false,
})

const props = withDefaults(defineProps<DateRangePickerProps>(), {
  maxDate: null,
  minDate: null,
  showPresets: true,
})

export interface DateRangePickerRange {
  end: Temporal.PlainDate | null
  start: Temporal.PlainDate | null
}

const modelValue = defineModel<DateRangePickerRange | null>({
  required: true,
})

const {
  isSingleMonth,
  calendarPlaceholder,
  draftValue,
  locale,
  maxDateValue,
  minDateValue,
  setPlaceholder,
  setPreset,
} = useDateRangePicker({
  maxDate: toRef(props, 'maxDate'),
  minDate: toRef(props, 'minDate'),
  modelValue,
})

useProvideDateRangeFieldContext({
  draftValue,
  placeholder: calendarPlaceholder,
  setPlaceholder,
  setPreset,
  onCancel: () => {},
})
</script>

<template>
  <ThemeProvider>
    <RekaDateRangePickerRoot
      v-model="draftValue"
      v-model:placeholder="calendarPlaceholder"
      :week-starts-on="getWeekStartsOn(locale)"
      :max-value="maxDateValue"
      :min-value="minDateValue"
      :locale="locale"
      :number-of-months="isSingleMonth ? 1 : 2"
      :close-on-select="false"
    >
      <RekaDateRangePickerCalendar
        v-slot="{ weekDays, grid }"
        :fixed-weeks="true"
        class="flex flex-col gap-lg overflow-hidden bg-primary"
        weekday-format="short"
      >
        <div class="flex h-full">
          <DateRangeFieldPresets v-if="props.showPresets" />

          <div class="flex min-w-0 flex-1 flex-col">
            <div class="flex">
              <div class="flex flex-1 flex-col">
                <DateRangeFieldCalendarHeader
                  :show-next="isSingleMonth"
                  side="left"
                />
                <div class="p-xl pt-0">
                  <DateRangeFieldCalendarGrid
                    :month="grid[0]"
                    :week-days="weekDays"
                  />
                </div>
              </div>

              <template v-if="!isSingleMonth">
                <div class="border-l border-secondary" />

                <div class="flex flex-1 flex-col">
                  <DateRangeFieldCalendarHeader side="right" />
                  <div class="p-xl pt-0">
                    <DateRangeFieldCalendarGrid
                      :month="grid[1]"
                      :week-days="weekDays"
                    />
                  </div>
                </div>
              </template>
            </div>
          </div>
        </div>
      </RekaDateRangePickerCalendar>
    </RekaDateRangePickerRoot>
  </ThemeProvider>
</template>
