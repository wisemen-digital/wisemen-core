<script setup lang="ts">
import {
  ChevronLeftIcon,
  ChevronRightIcon,
} from '@wisemen/vue-core-icons'
import {
  DatePickerHeader as RekaDatePickerHeader,
  DatePickerNext as RekaDatePickerNext,
  DatePickerPrev as RekaDatePickerPrev,
} from 'reka-ui'
import { useI18n } from 'vue-i18n'

import IconButton from '@/ui/button/icon/IconButton.vue'
import { useInjectDatePickerContext } from '@/ui/date-picker/datePicker.context'
import DatePickerMonthPopover from '@/ui/date-picker/DatePickerMonthPopover.vue'
import DatePickerYearPopover from '@/ui/date-picker/DatePickerYearPopover.vue'

const i18n = useI18n()

const {
  placeholder, setPlaceholder,
} = useInjectDatePickerContext()
</script>

<template>
  <RekaDatePickerHeader class="flex items-center justify-between">
    <RekaDatePickerPrev :as-child="true">
      <IconButton
        :icon="ChevronLeftIcon"
        :label="i18n.t('component.date_picker.previous_month')"
        size="md"
        variant="tertiary"
      />
    </RekaDatePickerPrev>

    <div class="flex items-center gap-xs">
      <DatePickerMonthPopover
        :placeholder="placeholder"
        @update:placeholder="setPlaceholder"
      />
      <DatePickerYearPopover
        :placeholder="placeholder"
        @update:placeholder="setPlaceholder"
      />
    </div>

    <RekaDatePickerNext :as-child="true">
      <IconButton
        :icon="ChevronRightIcon"
        :label="i18n.t('component.date_picker.next_month')"
        size="md"
        variant="tertiary"
      />
    </RekaDatePickerNext>
  </RekaDatePickerHeader>
</template>
