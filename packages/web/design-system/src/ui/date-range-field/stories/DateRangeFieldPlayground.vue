<script setup lang="ts">
import type { Temporal } from 'temporal-polyfill'
import { ref } from 'vue'

import type { DateRangeFieldProps } from '@/ui/date-range-field/dateRangeField.props'
import type { DateRangeFieldRange } from '@/ui/date-range-field/DateRangeField.vue'
import DateRangeField from '@/ui/date-range-field/DateRangeField.vue'

const props = withDefaults(defineProps<{
  maxDate?: Temporal.PlainDate | null
  minDate?: Temporal.PlainDate | null
  isDisabled?: boolean
  isLoading?: boolean
  isReadonly?: boolean
  isRequired?: boolean
  disabledReason?: string
  errorMessage?: DateRangeFieldProps['errorMessage']
  hideErrorMessage?: boolean
  hint?: DateRangeFieldProps['hint']
  label?: string
  placeholder?: string
  size?: DateRangeFieldProps['size']
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

const modelValue = ref<DateRangeFieldRange | null>(null)
</script>

<template>
  <div class="flex items-center gap-md">
    <DateRangeField
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
