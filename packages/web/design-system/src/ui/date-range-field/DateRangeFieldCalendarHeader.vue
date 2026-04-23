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
import DatePickerMonthPopover from '@/ui/date-field/DatePickerMonthPopover.vue'
import DatePickerYearPopover from '@/ui/date-field/DatePickerYearPopover.vue'
import { useInjectDateRangeFieldContext } from '@/ui/date-range-field/dateRangeField.context'

const props = defineProps<{
  showNext?: boolean
  side: 'left' | 'right'
}>()

const i18n = useI18n()

const {
  placeholder, setPlaceholder,
} = useInjectDateRangeFieldContext()

const displayPlaceholder = computed<CalendarDate>(() =>
  props.side === 'left'
    ? placeholder.value
    : placeholder.value.add({
      months: 1,
    }) as CalendarDate)

function onPlaceholderUpdate(date: CalendarDate): void {
  setPlaceholder(
    props.side === 'left'
      ? date
      : date.subtract({
        months: 1,
      }) as CalendarDate,
  )
}
</script>

<template>
  <div class="flex items-center p-xl pb-0">
    <RekaDateRangePickerPrev
      v-if="props.side === 'left'"
      :as-child="true"
    >
      <IconButton
        :icon="ChevronLeftIcon"
        :label="i18n.t('component.date_range_picker.previous_month')"
        size="md"
        variant="tertiary"
      />
    </RekaDateRangePickerPrev>
    <div
      v-else
      class="size-9 shrink-0"
    />

    <div class="flex flex-1 items-center justify-center gap-xs">
      <DatePickerMonthPopover
        :placeholder="displayPlaceholder"
        @update:placeholder="onPlaceholderUpdate"
      />
      <DatePickerYearPopover
        :placeholder="displayPlaceholder"
        @update:placeholder="onPlaceholderUpdate"
      />
    </div>

    <RekaDateRangePickerNext
      v-if="props.side === 'right' || props.showNext"
      :as-child="true"
    >
      <IconButton
        :icon="ChevronRightIcon"
        :label="i18n.t('component.date_range_picker.next_month')"
        size="md"
        variant="tertiary"
      />
    </RekaDateRangePickerNext>
    <div
      v-else
      class="size-9 shrink-0"
    />
  </div>
</template>
