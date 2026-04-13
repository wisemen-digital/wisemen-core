<script setup lang="ts">
import {
  ref,
  watch,
} from 'vue'

import IconButton from '@/components/button/icon-button/IconButton.vue'
import DateRangePicker from '@/components/date-picker/range/DateRangePicker.vue'
import { useInjectDateRangeFieldContext } from '@/components/date-range-field/dateRangeField.context'
import Popover from '@/components/popover/Popover.vue'

const {
  maxDate,
  minDate,
  weekStartsOn,
  isDateDisabled,
  isDateUnavailable,
  isDisabled,
  allowDeselect,
  allowNonContinuousSelection,
  classConfig,
  customClassConfig,
  dontCloseOnSelect,
  hideDatePicker,
  label,
  locale,
  modelValue,
  placeholderValue,
  showTwoMonths,
} = useInjectDateRangeFieldContext()

const isOpen = ref<boolean>(false)

watch(
  () => [
    modelValue.value.from?.toString(),
    modelValue.value.until?.toString(),
  ],
  ([
    _from,
    until,
  ]) => {
    if (dontCloseOnSelect.value || !isOpen.value) {
      return
    }

    if (until !== undefined) {
      isOpen.value = false
    }
  },
)
</script>

<template>
  <Popover
    v-if="!hideDatePicker"
    v-model:is-open="isOpen"
    :is-popover-arrow-hidden="true"
    popover-align="end"
  >
    <template #trigger>
      <IconButton
        :is-disabled="isDisabled"
        :class-config="{
          icon: 'size-4',
          root: 'min-w-7 h-7 rounded-[0.3rem]',
        }"
        icon="calendarIcon"
        label="Open"
        variant="tertiary"
        size="sm"
        class="mr-[0.3rem]"
      />
    </template>

    <template #content>
      <div class="p-lg">
        <DateRangePicker
          v-model="modelValue"
          :focus-on-mount="true"
          :allow-deselect="allowDeselect"
          :placeholder-value="placeholderValue"
          :is-date-disabled="isDateDisabled"
          :week-starts-on="weekStartsOn"
          :locale="locale"
          :allow-non-continuous-selection="allowNonContinuousSelection"
          :is-date-unavailable="isDateUnavailable"
          :max-date="maxDate"
          :min-date="minDate"
          :show-two-months="showTwoMonths"
          :label="label ?? ''"
          :class-config="{
            ...customClassConfig.datePicker,
            ...classConfig?.datePicker,
          }"
        />
      </div>
    </template>
  </Popover>
</template>
