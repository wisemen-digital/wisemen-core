<script setup lang="ts">
import type { CalendarDate } from '@internationalized/date'
import {
  ChevronLeftIcon,
  ChevronRightIcon,
} from '@wisemen/vue-core-icons'
import {
  DateRangePickerNext as RekaDateRangePickerNext,
  DateRangePickerPrev as RekaDateRangePickerPrev,
} from 'reka-ui'
import { computed } from 'vue'
import { useI18n } from 'vue-i18n'

import IconButton from '@/ui/button/icon/IconButton.vue'
import DatePickerMonthPopover from '@/ui/date-picker/DatePickerMonthPopover.vue'
import DatePickerYearPopover from '@/ui/date-picker/DatePickerYearPopover.vue'
import { useInjectDateRangePickerContext } from '@/ui/date-range-picker/dateRangePicker.context'

const i18n = useI18n()

const {
  placeholder, setPlaceholder,
} = useInjectDateRangePickerContext()

const rightPlaceholder = computed<CalendarDate>(
  () => placeholder.value.add({
    months: 1,
  }) as CalendarDate,
)

function setRightPlaceholder(date: CalendarDate): void {
  setPlaceholder(date.subtract({
    months: 1,
  }) as CalendarDate)
}
</script>

<template>
  <div class="flex items-center justify-between p-xl pb-0">
    <div class="flex items-center gap-xs">
      <RekaDateRangePickerPrev :as-child="true">
        <IconButton
          :icon="ChevronLeftIcon"
          :label="i18n.t('component.date_range_picker.previous_month')"
          size="md"
          variant="tertiary"
        />
      </RekaDateRangePickerPrev>
      <DatePickerMonthPopover
        :placeholder="placeholder"
        @update:placeholder="setPlaceholder"
      />
      <DatePickerYearPopover
        :placeholder="placeholder"
        @update:placeholder="setPlaceholder"
      />
    </div>

    <div class="flex items-center gap-xs">
      <DatePickerMonthPopover
        :placeholder="rightPlaceholder"
        @update:placeholder="setRightPlaceholder"
      />
      <DatePickerYearPopover
        :placeholder="rightPlaceholder"
        @update:placeholder="setRightPlaceholder"
      />
      <RekaDateRangePickerNext :as-child="true">
        <IconButton
          :icon="ChevronRightIcon"
          :label="i18n.t('component.date_range_picker.next_month')"
          size="md"
          variant="tertiary"
        />
      </RekaDateRangePickerNext>
    </div>
  </div>
</template>
