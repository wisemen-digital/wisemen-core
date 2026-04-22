<script setup lang="ts">
import { CalendarDate } from '@internationalized/date'
import { CalendarIcon } from '@wisemen/vue-core-icons'
import type { DateValue } from 'reka-ui'
import {
  DatePickerCalendar as RekaDatePickerCalendar,
  DatePickerContent as RekaDatePickerContent,
  DatePickerRoot as RekaDatePickerRoot,
  DatePickerTrigger as RekaDatePickerTrigger,
} from 'reka-ui'
import { Temporal } from 'temporal-polyfill'
import {
  computed,
  ref,
  shallowRef,
  useAttrs,
  useId,
} from 'vue'

import { useInput } from '@/composables/input.composable'
import {
  INPUT_DEFAULTS,
  INPUT_FIELD_DEFAULTS,
  INPUT_META_DEFAULTS,
} from '@/types/input.type'
import { useProvideDatePickerContext } from '@/ui/date-picker/datePicker.context'
import type { DatePickerProps } from '@/ui/date-picker/datePicker.props'
import { createDatePickerStyle } from '@/ui/date-picker/datePicker.style'
import DatePickerCalendarGrid from '@/ui/date-picker/DatePickerCalendarGrid.vue'
import DatePickerCalendarHeader from '@/ui/date-picker/DatePickerCalendarHeader.vue'
import DatePickerInputRow from '@/ui/date-picker/DatePickerInputRow.vue'
import FieldWrapper from '@/ui/field-wrapper/FieldWrapper.vue'
import InputWrapper from '@/ui/input-wrapper/InputWrapper.vue'
import ThemeProvider from '@/ui/theme-provider/ThemeProvider.vue'
import { getWeekStartsOn } from '@/utils/weekStartsOn.util'

defineOptions({
  inheritAttrs: false,
})

const props = withDefaults(defineProps<DatePickerProps>(), {
  ...INPUT_DEFAULTS,
  ...INPUT_META_DEFAULTS,
  ...INPUT_FIELD_DEFAULTS,
  maxDate: null,
  minDate: null,
  placeholder: 'Select date',
  size: 'md',
})

const modelValue = defineModel<Temporal.PlainDate | null>({
  required: true,
})

const locale = navigator.language

const id = props.id ?? useId()

const attrs = useAttrs()

const {
  isError,
  ariaDescribedBy,
  ariaInvalid,
} = useInput(id, props)

const isOpen = ref(false)

const datePickerStyle = computed(() => createDatePickerStyle({
  size: props.size,
}))

const todayDate = Temporal.Now.plainDateISO()
const calendarPlaceholder = shallowRef<CalendarDate>(
  new CalendarDate(todayDate.year, todayDate.month, todayDate.day),
)

useProvideDatePickerContext({
  datePickerStyle,
  placeholder: calendarPlaceholder,
  setPlaceholder: (date) => { calendarPlaceholder.value = date },
  onClose: () => { isOpen.value = false },
})

function plainDateToCalendarDate(date: Temporal.PlainDate): CalendarDate {
  return new CalendarDate(date.year, date.month, date.day)
}

function calendarDateToPlainDate(date: DateValue): Temporal.PlainDate {
  return Temporal.PlainDate.from({
    day: date.day,
    month: date.month,
    year: date.year,
  })
}

const calendarValue = computed<DateValue | undefined>({
  get: () => {
    if (modelValue.value === null) {
      return
    }

    return plainDateToCalendarDate(modelValue.value) as DateValue
  },
  set: (value) => {
    if (value === null || value === undefined) {
      modelValue.value = null
    }
    else {
      modelValue.value = calendarDateToPlainDate(value)
    }
  },
})

const minDateValue = computed<DateValue | undefined>(() => {
  if (props.minDate == null) {
    return
  }

  return plainDateToCalendarDate(props.minDate) as DateValue
})

const maxDateValue = computed<DateValue | undefined>(() => {
  if (props.maxDate == null) {
    return
  }

  return plainDateToCalendarDate(props.maxDate) as DateValue
})

function setToday(): void {
  modelValue.value = Temporal.Now.plainDateISO()
  isOpen.value = false
}

const displayValue = computed<string>(() => {
  if (modelValue.value === null) {
    return ''
  }

  return modelValue.value.toLocaleString(locale, {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  })
})
</script>

<template>
  <InputWrapper
    :error-message="props.errorMessage"
    :is-disabled="props.isDisabled"
    :is-required="props.isRequired"
    :disabled-reason="props.disabledReason"
    :hint="props.hint"
    :label="props.label"
    :class="props.class"
    :style="props.style"
    :for="id"
    :help-text="props.helpText"
    :hide-error-message="props.hideErrorMessage"
  >
    <template #label-left>
      <slot name="label-left" />
    </template>

    <template #label-right>
      <slot name="label-right" />
    </template>

    <RekaDatePickerRoot
      :id="id"
      v-model="calendarValue"
      v-model:open="isOpen"
      v-model:placeholder="calendarPlaceholder"
      :week-starts-on="getWeekStartsOn(locale)"
      :disabled="props.isDisabled"
      :max-value="maxDateValue"
      :min-value="minDateValue"
      :readonly="props.isReadonly"
      :required="props.isRequired"
      :locale="locale"
    >
      <RekaDatePickerTrigger :as-child="true">
        <FieldWrapper
          :is-disabled="props.isDisabled"
          :is-error="isError"
          :is-loading="props.isLoading"
          :is-readonly="props.isReadonly"
          :size="props.size"
        >
          <button
            v-bind="attrs"
            :id="id"
            :aria-describedby="ariaDescribedBy"
            :aria-invalid="ariaInvalid"
            :aria-required="props.isRequired || undefined"
            :data-placeholder="displayValue === '' || undefined"
            :disabled="props.isDisabled || props.isReadonly"
            :class="datePickerStyle.trigger()"
            type="button"
            data-field-wrapper
          >
            <CalendarIcon
              class="
                size-3.5 shrink-0 text-fg-quaternary
                group-data-disabled/field-wrapper:text-fg-disabled-subtle
              "
            />
            <span class="truncate text-xs">{{ displayValue || props.placeholder }}</span>
          </button>
        </FieldWrapper>
      </RekaDatePickerTrigger>

      <ThemeProvider :as-child="true">
        <RekaDatePickerContent
          :side-offset="4"
          class="
            z-40 origin-(--reka-popover-content-transform-origin)
            will-change-[transform,opacity]
          "
          align="start"
        >
          <RekaDatePickerCalendar
            v-slot="{ weekDays, grid }"
            :fixed-weeks="true"
            class="
              flex flex-col gap-lg overflow-hidden rounded-2xl border
              border-secondary bg-primary p-2xl px-3xl shadow-lg
            "
            weekday-format="short"
          >
            <DatePickerCalendarHeader />

            <DatePickerInputRow @today="setToday" />

            <DatePickerCalendarGrid
              v-for="month in grid"
              :key="month.value.toString()"
              :month="month"
              :week-days="weekDays"
            />
          </RekaDatePickerCalendar>
        </RekaDatePickerContent>
      </ThemeProvider>
    </RekaDatePickerRoot>
  </InputWrapper>
</template>
