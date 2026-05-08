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
import DatePickerMonthPopover from '@/ui/date-field/DatePickerMonthPopover.vue'
import DatePickerYearPopover from '@/ui/date-field/DatePickerYearPopover.vue'
import { useInjectDatePickerContext } from '@/ui/date-picker/datePicker.context'

const i18n = useI18n()

const {
  placeholder, setPlaceholder,
} = useInjectDatePickerContext()
</script>

<template>
  <RekaDatePickerHeader class="flex items-center justify-between">
    <RekaDatePickerPrev
      v-slot="{ disabled }"
      :as-child="true"
    >
      <IconButton
        :is-disabled="disabled"
        :icon="ChevronLeftIcon"
        :label="i18n.t('component.date_picker.previous_month')"
        size="md"
        variant="tertiary"
      />
    </RekaDatePickerPrev>

    <div class="flex items-center gap-none">
      <DatePickerMonthPopover
        :placeholder="placeholder"
        @update:placeholder="setPlaceholder"
      />
      <DatePickerYearPopover
        :placeholder="placeholder"
        @update:placeholder="setPlaceholder"
      />
    </div>

    <RekaDatePickerNext
      v-slot="{ disabled }"
      :as-child="true"
    >
      <IconButton
        :is-disabled="disabled"
        :icon="ChevronRightIcon"
        :label="i18n.t('component.date_picker.next_month')"
        size="md"
        variant="tertiary"
      />
    </RekaDatePickerNext>
  </RekaDatePickerHeader>
</template>
