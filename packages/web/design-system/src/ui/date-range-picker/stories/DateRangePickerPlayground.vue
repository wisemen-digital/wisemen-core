<script setup lang="ts">
import type { Temporal } from 'temporal-polyfill'
import { ref } from 'vue'

import type { DateRangePickerProps } from '@/ui/date-range-picker/dateRangePicker.props'
import type { DateRangePickerRange } from '@/ui/date-range-picker/DateRangePicker.vue'
import DateRangePicker from '@/ui/date-range-picker/DateRangePicker.vue'

const props = withDefaults(defineProps<{
  maxDate?: Temporal.PlainDate | null
  minDate?: Temporal.PlainDate | null
  isDisabled?: boolean
  isLoading?: boolean
  isReadonly?: boolean
  isRequired?: boolean
  disabledReason?: string
  errorMessage?: DateRangePickerProps['errorMessage']
  hideErrorMessage?: boolean
  hint?: DateRangePickerProps['hint']
  label?: string
  placeholder?: string
  size?: DateRangePickerProps['size']
}>(), {
  isDisabled: false,
  isLoading: false,
  isReadonly: false,
  isRequired: false,
  errorMessage: undefined,
  hideErrorMessage: false,
  hint: undefined,
  label: 'Date range',
  placeholder: 'Select a date range...',
  size: 'md',
})

const modelValue = ref<DateRangePickerRange | null>(null)
</script>

<template>
  <div class="flex items-center gap-md">
    <DateRangePicker
      v-model="modelValue"
      :error-message="props.errorMessage"
      :hide-error-message="props.hideErrorMessage"
      :hint="props.hint"
      :is-disabled="props.isDisabled"
      :is-loading="props.isLoading"
      :is-readonly="props.isReadonly"
      :is-required="props.isRequired"
      :label="props.label"
      :placeholder="props.placeholder"
      :size="props.size"
      :min-date="props.minDate ?? null"
      :max-date="props.maxDate ?? null"
      class="w-72"
    />
  </div>
</template>
