<script setup lang="ts">
import { CalendarDate } from '@internationalized/date'
import { CalendarIcon } from '@wisemen/vue-core-icons'
import type { DateValue } from 'reka-ui'
import {
  DatePickerCalendar as RekaDatePickerCalendar,
  DatePickerContent as RekaDatePickerContent,
  DatePickerField as RekaDatePickerField,
  DatePickerInput as RekaDatePickerInput,
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
import { useI18n } from 'vue-i18n'

import { useInput } from '@/composables/input.composable'
import {
  INPUT_DEFAULTS,
  INPUT_FIELD_DEFAULTS,
  INPUT_META_DEFAULTS,
} from '@/types/input.type'
import { UIIconButton } from '@/ui/button'
import type { DateFieldProps } from '@/ui/date-field/dateField.props'
import { createDateFieldStyle } from '@/ui/date-field/dateField.style'
import DatePickerCalendarGrid from '@/ui/date-field/DatePickerCalendarGrid.vue'
import DatePickerCalendarHeader from '@/ui/date-field/DatePickerCalendarHeader.vue'
import { useProvideDatePickerFieldContext } from '@/ui/date-field/datePickerField.context'
import { createDatePickerFieldStyle } from '@/ui/date-field/datePickerField.style'
import DatePickerInputRow from '@/ui/date-field/DatePickerInputRow.vue'
import FieldWrapper from '@/ui/field-wrapper/FieldWrapper.vue'
import InputWrapper from '@/ui/input-wrapper/InputWrapper.vue'
import ThemeProvider from '@/ui/theme-provider/ThemeProvider.vue'
import { getWeekStartsOn } from '@/utils/weekStartsOn.util'

defineOptions({
  inheritAttrs: false,
})

const props = withDefaults(defineProps<DateFieldProps>(), {
  ...INPUT_DEFAULTS,
  ...INPUT_META_DEFAULTS,
  ...INPUT_FIELD_DEFAULTS,
  maxDate: null,
  minDate: null,
  isPickerHidden: false,
  size: 'md',
})

const modelValue = defineModel<Temporal.PlainDate | null>({
  required: true,
})

const i18n = useI18n()

const locale = navigator.language

const id = props.id ?? useId()

const attrs = useAttrs()

const {
  isError,
  ariaDescribedBy,
  ariaInvalid,
} = useInput(id, props)

const isOpen = ref(false)

const dateFieldStyle = computed(() => createDateFieldStyle({
  isPickerHidden: props.isPickerHidden,
  size: props.size,
}))

const datePickerStyle = computed(() => createDatePickerFieldStyle({
  size: props.size,
}))

const todayDate = Temporal.Now.plainDateISO()
const calendarPlaceholder = shallowRef<CalendarDate>(
  new CalendarDate(todayDate.year, todayDate.month, todayDate.day),
)

useProvideDatePickerFieldContext({
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
      <FieldWrapper
        :is-disabled="props.isDisabled"
        :is-error="isError"
        :is-loading="props.isLoading"
        :is-readonly="props.isReadonly"
        :size="props.size"
      >
        <RekaDatePickerField
          :id="id"
          v-slot="{ segments }"
          v-bind="attrs"
          :aria-describedby="ariaDescribedBy"
          :aria-invalid="ariaInvalid"
          :aria-required="props.isRequired || undefined"
          :class="dateFieldStyle.field()"
        >
          <template
            v-for="{ part, value } in segments"
            :key="part"
          >
            <RekaDatePickerInput
              v-if="part !== 'literal'"
              :part="part"
              :class="dateFieldStyle.segment()"
              data-field-wrapper
            >
              {{ value }}
            </RekaDatePickerInput>
            <RekaDatePickerInput
              v-else
              :part="part"
              :class="dateFieldStyle.literal()"
            >
              {{ value }}
            </RekaDatePickerInput>
          </template>
        </RekaDatePickerField>

        <template
          v-if="!props.isPickerHidden"
          #right
        >
          <RekaDatePickerTrigger
            :as-child="true"
          >
            <UIIconButton
              :is-disabled="props.isDisabled || props.isReadonly"
              :is-tooltip-disabled="true"
              :icon="CalendarIcon"
              :label="i18n.t('component.date_picker.open')"
              size="xs"
              type="button"
              variant="tertiary"
              :class="{
                'mr-xs': props.size === 'md',
                'mr-xxs': props.size === 'sm',
              }"
            />
          </RekaDatePickerTrigger>
        </template>
      </FieldWrapper>

      <ThemeProvider :as-child="true">
        <RekaDatePickerContent
          :side-offset="4"
          class="
            z-40 origin-(--reka-popover-content-transform-origin)
            will-change-[transform,opacity]
          "
          align="end"
        >
          <RekaDatePickerCalendar
            v-slot="{ weekDays, grid }"
            class="
              flex flex-col gap-lg overflow-hidden rounded-2xl border
              border-secondary bg-primary px-xl py-lg shadow-lg
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
