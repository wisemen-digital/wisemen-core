<script setup lang="ts">
import type { Temporal } from 'temporal-polyfill'
import { ref } from 'vue'

import type { DateFieldProps } from '@/ui/date-field/dateField.props'
import DateField from '@/ui/date-field/DateField.vue'

const props = withDefaults(defineProps<{
  maxDate?: Temporal.PlainDate | null
  minDate?: Temporal.PlainDate | null
  isDisabled?: boolean
  isLoading?: boolean
  isReadonly?: boolean
  isRequired?: boolean
  disabledReason?: string
  errorMessage?: DateFieldProps['errorMessage']
  hideErrorMessage?: boolean
  hint?: DateFieldProps['hint']
  label?: string
  size?: DateFieldProps['size']
}>(), {
  isDisabled: false,
  isLoading: false,
  isReadonly: false,
  isRequired: false,
  errorMessage: undefined,
  hideErrorMessage: false,
  hint: undefined,
  label: 'Date',
  size: 'md',
})

const modelValue = ref<Temporal.PlainDate | null>(null)
</script>

<template>
  <div class="flex items-center gap-md">
    <DateField
      v-model="modelValue"
      :error-message="props.errorMessage"
      :hide-error-message="props.hideErrorMessage"
      :hint="props.hint"
      :is-disabled="props.isDisabled"
      :is-loading="props.isLoading"
      :is-readonly="props.isReadonly"
      :is-required="props.isRequired"
      :label="props.label"
      :size="props.size"
      :min-date="props.minDate ?? null"
      :max-date="props.maxDate ?? null"
      class="w-72"
    />
  </div>
</template>
