<script setup lang="ts">
import {
  ChevronLeftIcon,
  ChevronRightIcon,
} from '@wisemen/vue-core-icons'
import type { DateValue } from 'reka-ui'
import {
  DateRangePickerNext as RekaDateRangePickerNext,
  DateRangePickerPrev as RekaDateRangePickerPrev,
} from 'reka-ui'
import { Temporal } from 'temporal-polyfill'
import { useI18n } from 'vue-i18n'

import IconButton from '@/ui/button/icon/IconButton.vue'

const props = defineProps<{
  grid: any[]
}>()

const i18n = useI18n()

const locale = navigator.language

function formatMonthYear(date: DateValue): string {
  return Temporal.PlainDate.from({
    day: 1,
    month: date.month,
    year: date.year,
  }).toLocaleString(locale, {
    month: 'long',
    year: 'numeric',
  })
}
</script>

<template>
  <div class="flex items-center justify-between p-xl pb-0">
    <RekaDateRangePickerPrev :as-child="true">
      <IconButton
        :icon="ChevronLeftIcon"
        :label="i18n.t('component.date_range_picker.previous_month')"
        size="md"
        variant="tertiary"
      />
    </RekaDateRangePickerPrev>

    <div class="flex flex-1 justify-around">
      <span
        v-for="month in props.grid"
        :key="month.value.toString()"
        class="text-sm font-semibold text-primary"
      >
        {{ formatMonthYear(month.value) }}
      </span>
    </div>

    <RekaDateRangePickerNext :as-child="true">
      <IconButton
        :icon="ChevronRightIcon"
        :label="i18n.t('component.date_range_picker.next_month')"
        size="md"
        variant="tertiary"
      />
    </RekaDateRangePickerNext>
  </div>
</template>
