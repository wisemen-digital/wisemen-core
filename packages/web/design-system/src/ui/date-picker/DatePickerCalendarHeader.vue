<script setup lang="ts">
import {
  ChevronLeftIcon,
  ChevronRightIcon,
} from '@wisemen/vue-core-icons'
import {
  DatePickerHeader as RekaDatePickerHeader,
  DatePickerHeading as RekaDatePickerHeading,
  DatePickerNext as RekaDatePickerNext,
  DatePickerPrev as RekaDatePickerPrev,
} from 'reka-ui'
import { useI18n } from 'vue-i18n'

import IconButton from '@/ui/button/icon/IconButton.vue'
import { useInjectDatePickerContext } from '@/ui/date-picker/datePicker.context'

const i18n = useI18n()

const {
  datePickerStyle,
} = useInjectDatePickerContext()
</script>

<template>
  <RekaDatePickerHeader :class="datePickerStyle.header()">
    <RekaDatePickerPrev :as-child="true">
      <IconButton
        :icon="ChevronLeftIcon"
        :label="i18n.t('component.date_picker.previous_month')"
        size="md"
        variant="tertiary"
      />
    </RekaDatePickerPrev>

    <RekaDatePickerHeading :class="datePickerStyle.heading()" />

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
