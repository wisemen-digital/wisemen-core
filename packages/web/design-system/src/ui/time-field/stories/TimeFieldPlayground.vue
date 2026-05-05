<script setup lang="ts">
import { Temporal } from 'temporal-polyfill'
import { ref } from 'vue'

import type { HourCycle } from '@/types/hourCycle.type'
import ConfigProvider from '@/ui/config-provider/ConfigProvider.vue'
import type { TimeFieldProps } from '@/ui/time-field/timeField.props'
import TimeField from '@/ui/time-field/TimeField.vue'

const props = withDefaults(defineProps<{
  isDisabled?: boolean
  isLoading?: boolean
  isReadonly?: boolean
  isRequired?: boolean
  disabledReason?: string
  errorMessage?: TimeFieldProps['errorMessage']
  hideErrorMessage?: boolean
  hint?: TimeFieldProps['hint']
  hourCycle?: HourCycle | null
  label?: string
  size?: TimeFieldProps['size']
}>(), {
  isDisabled: false,
  isLoading: false,
  isReadonly: false,
  isRequired: false,
  errorMessage: undefined,
  hideErrorMessage: false,
  hint: undefined,
  hourCycle: null,
  label: 'Time',
  size: 'md',
})

const modelValue = ref<Temporal.PlainTime | null>(null)
</script>

<template>
  <div class="flex items-center gap-md">
    <ConfigProvider
      locale="en-US"
      :hour-cycle="props.hourCycle ?? undefined"
    >
      <TimeField
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
        class="w-56"
      />
    </ConfigProvider>
  </div>
</template>
