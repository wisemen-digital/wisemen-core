<script setup lang="ts">
import type { Temporal } from 'temporal-polyfill'
import { ref } from 'vue'

import type { DatePickerProps } from '@/ui/date-picker/datePicker.props'
import DatePicker from '@/ui/date-picker/DatePicker.vue'

const props = withDefaults(defineProps<{
  maxDate?: Temporal.PlainDate | null
  minDate?: Temporal.PlainDate | null
  isDisabled?: boolean
  isLoading?: boolean
  isReadonly?: boolean
  isRequired?: boolean
  disabledReason?: string
  errorMessage?: DatePickerProps['errorMessage']
  hideErrorMessage?: boolean
  hint?: DatePickerProps['hint']
  label?: string
  placeholder?: string
  size?: DatePickerProps['size']
}>(), {
  isDisabled: false,
  isLoading: false,
  isReadonly: false,
  isRequired: false,
  errorMessage: undefined,
  hideErrorMessage: false,
  hint: undefined,
  label: 'Date',
  placeholder: 'Select a date...',
  size: 'md',
})

const modelValue = ref<Temporal.PlainDate | null>(null)
</script>

<template>
  <div class="flex items-center gap-md">
    <DatePicker
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
