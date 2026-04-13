<script setup lang="ts">
import type { DateValue } from 'reka-ui'
import { CalendarRoot as RekaCalendarRoot } from 'reka-ui'
import { Temporal } from 'temporal-polyfill'
import { computed } from 'vue'

import type { ResolvedClassConfig } from '@/class-variant/classVariant.type'
import { getCustomComponentVariant } from '@/class-variant/customClassVariants'
import type { Grid } from '@/components/date-picker/shared/datePicker.type'
import {
  dateValueToPlainDate,
  plainDateToDateValue,
} from '@/components/date-picker/shared/datePicker.util'
import { useProvideDatePickerContext } from '@/components/date-picker/single/datePicker.context'
import type { DatePickerProps } from '@/components/date-picker/single/datePicker.props'
import type { CreateDatePickerStyle } from '@/components/date-picker/single/datePicker.style'
import { createDatePickerStyle } from '@/components/date-picker/single/datePicker.style'
import InteractableElement from '@/components/shared/InteractableElement.vue'
import TestIdProvider from '@/components/shared/TestIdProvider.vue'
import { injectThemeProviderContext } from '@/components/theme-provider/themeProvider.context'
import { toComputedRefs } from '@/utils/props.util'

const props = withDefaults(defineProps<DatePickerProps>(), {
  id: null,
  testId: null,
  maxDate: null,
  minDate: null,
  weekStartsOn: 0,
  isDateDisabled: () => false,
  isDateUnavailable: () => false,
  isDisabled: false,
  allowDeselect: false,
  focusOnMount: false,
  showTwoMonths: false,
  variant: null,
})

const modelValue = defineModel<Temporal.PlainDate | null>({
  required: true,
})

const placeholderValue = defineModel<Temporal.PlainDate>('placeholderValue', {
  required: false,
})

const resolvedLocale = computed<string>(() => {
  return props.locale ?? navigator.language
})

const delegatedModel = computed<DateValue | undefined>({
  get: () => {
    if (modelValue.value === null) {
      return
    }

    return plainDateToDateValue(modelValue.value)
  },
  set: (value) => {
    if (value === null || value === undefined) {
      modelValue.value = null

      return
    }

    modelValue.value = dateValueToPlainDate(value)
  },
})

const delegatedPlaceholderValue = computed<DateValue>({
  get: () => {
    return plainDateToDateValue(placeholderValue.value ?? modelValue.value ?? Temporal.Now.plainDateISO())
  },
  set: (value) => {
    placeholderValue.value = dateValueToPlainDate(value)
  },
})

const {
  theme,
} = injectThemeProviderContext()

const datePickerStyle = computed<CreateDatePickerStyle>(
  () => createDatePickerStyle({
    variant: props.variant ?? undefined,
  }),
)

const customClassConfig = computed<ResolvedClassConfig<'datePicker'>>(
  () => getCustomComponentVariant('datePicker', theme.value, {
    variant: props.variant,
  }),
)

useProvideDatePickerContext({
  ...toComputedRefs(props),
  customClassConfig,
  modelValue,
  placeholderValue: computed<Temporal.PlainDate>({
    get: () => dateValueToPlainDate(delegatedPlaceholderValue.value),
    set: (value) => {
      delegatedPlaceholderValue.value = plainDateToDateValue(value)
    },
  }),
  style: datePickerStyle,
})
</script>

<template>
  <TestIdProvider :test-id="props.testId">
    <InteractableElement :is-disabled="props.isDisabled">
      <RekaCalendarRoot
        v-slot="{ weekDays, grid }"
        v-model="delegatedModel"
        v-model:placeholder="delegatedPlaceholderValue"
        :week-starts-on="props.weekStartsOn"
        :prevent-deselect="!props.allowDeselect"
        :fixed-weeks="true"
        :number-of-months="props.showTwoMonths ? 2 : 1"
        :is-date-unavailable="(value: DateValue) => props.isDateUnavailable(dateValueToPlainDate(value))"
        :is-date-disabled="(value: DateValue) => props.isDateDisabled(dateValueToPlainDate(value))"
        :calendar-label="props.label"
        :initial-focus="props.focusOnMount"
        :locale="resolvedLocale"
        :min-value="props.minDate === null
          ? undefined
          : plainDateToDateValue(props.minDate)"
        :max-value="props.maxDate === null
          ? undefined
          : plainDateToDateValue(props.maxDate)"
        weekday-format="short"
      >
        <slot
          :week-days="(weekDays as string[])"
          :grid="(grid as Grid<DateValue>[])"
        />
      </RekaCalendarRoot>
    </InteractableElement>
  </TestIdProvider>
</template>
