<script setup lang="ts">
import type { DateValue } from '@internationalized/date'
import { CalendarDate } from '@internationalized/date'
import {
  CalendarIcon,
  ChevronLeftIcon,
} from '@wisemen/vue-core-icons'
import type { DateRange } from 'reka-ui'
import {
  DateRangePickerCalendar as RekaDateRangePickerCalendar,
  DateRangePickerContent as RekaDateRangePickerContent,
  DateRangePickerPrev as RekaDateRangePickerPrev,
  DateRangePickerRoot as RekaDateRangePickerRoot,
  DateRangePickerTrigger as RekaDateRangePickerTrigger,
} from 'reka-ui'
import { Temporal } from 'temporal-polyfill'
import type { Ref } from 'vue'
import {
  computed,
  ref,
  shallowRef,
  useAttrs,
  useId,
  watch,
} from 'vue'
import { useI18n } from 'vue-i18n'

import { useInput } from '@/composables/input.composable'
import {
  INPUT_DEFAULTS,
  INPUT_FIELD_DEFAULTS,
  INPUT_META_DEFAULTS,
} from '@/types/input.type'
import IconButton from '@/ui/button/icon/IconButton.vue'
import { useProvideDateRangePickerContext } from '@/ui/date-range-picker/dateRangePicker.context'
import type { DateRangePickerProps } from '@/ui/date-range-picker/dateRangePicker.props'
import { createDateRangePickerStyle } from '@/ui/date-range-picker/dateRangePicker.style'
import DateRangePickerCalendarGrid from '@/ui/date-range-picker/DateRangePickerCalendarGrid.vue'
import DateRangePickerCalendarHeader from '@/ui/date-range-picker/DateRangePickerCalendarHeader.vue'
import DateRangePickerInputRow from '@/ui/date-range-picker/DateRangePickerInputRow.vue'
import DateRangePickerPresets from '@/ui/date-range-picker/DateRangePickerPresets.vue'
import FieldWrapper from '@/ui/field-wrapper/FieldWrapper.vue'
import InputWrapper from '@/ui/input-wrapper/InputWrapper.vue'
import ThemeProvider from '@/ui/theme-provider/ThemeProvider.vue'
import { getWeekStartsOn } from '@/utils/weekStartsOn.util'

defineOptions({
  inheritAttrs: false,
})

const props = withDefaults(defineProps<DateRangePickerProps>(), {
  ...INPUT_DEFAULTS,
  ...INPUT_META_DEFAULTS,
  ...INPUT_FIELD_DEFAULTS,
  maxDate: null,
  minDate: null,
  placeholder: 'Select date range',
  size: 'md',
})

export interface DateRangePickerRange {
  end: Temporal.PlainDate | null
  start: Temporal.PlainDate | null
}

const modelValue = defineModel<DateRangePickerRange | null>({
  required: true,
})

const locale = navigator.language

const id = props.id ?? useId()

const attrs = useAttrs()

const i18n = useI18n()

const {
  isError,
  ariaDescribedBy,
  ariaInvalid,
} = useInput(id, props)

const isOpen = ref(false)

const dateRangePickerStyle = computed(() => createDateRangePickerStyle({
  size: props.size,
}))

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

const draftValue = ref<DateRange>({
  end: undefined,
  start: undefined,
}) as Ref<DateRange>

const todayDate = Temporal.Now.plainDateISO()
const calendarPlaceholder = shallowRef<CalendarDate>(
  new CalendarDate(todayDate.year, todayDate.month, 1),
)

watch(isOpen, (open) => {
  if (open) {
    draftValue.value = {
      end: modelValue.value?.end != null ? plainDateToCalendarDate(modelValue.value.end) : undefined,
      start: modelValue.value?.start != null ? plainDateToCalendarDate(modelValue.value.start) : undefined,
    }
  }
})

function onApply(): void {
  const {
    end, start,
  } = draftValue.value

  if (start != null && end != null) {
    modelValue.value = {
      end: calendarDateToPlainDate(end),
      start: calendarDateToPlainDate(start),
    }
  }
  else {
    modelValue.value = null
  }

  isOpen.value = false
}

function onCancel(): void {
  isOpen.value = false
}

function setPreset(range:
  { end: Temporal.PlainDate
    start: Temporal.PlainDate } | null): void {
  if (range === null) {
    draftValue.value = {
      end: undefined,
      start: undefined,
    }
  }
  else {
    draftValue.value = {
      end: plainDateToCalendarDate(range.end),
      start: plainDateToCalendarDate(range.start),
    }
  }
}

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

function formatDate(date: Temporal.PlainDate): string {
  return date.toLocaleString(locale, {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  })
}

const displayValue = computed<string>(() => {
  if (modelValue.value?.start == null && modelValue.value?.end == null) {
    return ''
  }

  const start = modelValue.value?.start != null ? formatDate(modelValue.value.start) : '…'
  const end = modelValue.value?.end != null ? formatDate(modelValue.value.end) : '…'

  return `${start} – ${end}`
})

useProvideDateRangePickerContext({
  draftValue,
  placeholder: calendarPlaceholder,
  setPlaceholder: (date) => { calendarPlaceholder.value = date },
  setPreset,
  onApply,
  onCancel,
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

    <RekaDateRangePickerRoot
      :id="id"
      v-model="draftValue"
      v-model:open="isOpen"
      v-model:placeholder="calendarPlaceholder"
      :week-starts-on="getWeekStartsOn(locale)"
      :disabled="props.isDisabled"
      :max-value="maxDateValue"
      :min-value="minDateValue"
      :readonly="props.isReadonly"
      :required="props.isRequired"
      :locale="locale"
      :number-of-months="2"
      :close-on-select="false"
    >
      <RekaDateRangePickerTrigger :as-child="true">
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
            :class="dateRangePickerStyle.trigger()"
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
      </RekaDateRangePickerTrigger>

      <ThemeProvider :as-child="true">
        <RekaDateRangePickerContent
          :side-offset="4"
          :collision-padding="10"
          class="
            z-40 origin-(--reka-popover-content-transform-origin)
            will-change-[transform,opacity]
          "
          align="start"
        >
          <RekaDateRangePickerCalendar
            v-slot="{ weekDays, grid }"
            :fixed-weeks="true"
            class="
              flex flex-col gap-lg overflow-hidden rounded-2xl border
              border-secondary bg-primary shadow-lg
            "
            weekday-format="short"
          >
            <div class="flex h-full">
              <DateRangePickerPresets />

              <div class="flex min-w-0 flex-1 flex-col gap-lg">
                <DateRangePickerCalendarHeader />

                <div class="flex gap-xl p-xl">
                  <template
                    v-for="(month, index) in grid"
                    :key="month.value.toString()"
                  >
                    <div class="flex flex-col">
                      <div class="w-full border p-xl">
                        <RekaDateRangePickerPrev
                          v-if="index === 0"
                          :as-child="true"
                        >
                          <IconButton
                            :icon="ChevronLeftIcon"
                            :label="i18n.t('component.date_range_picker.previous_month')"
                            size="md"
                            variant="tertiary"
                          />
                        </RekaDateRangePickerPrev>
                      </div>
                      <DateRangePickerCalendarGrid
                        :month="month"
                        :week-days="weekDays"
                      />
                    </div>
                  </template>
                </div>

                <DateRangePickerInputRow />
              </div>
            </div>
          </RekaDateRangePickerCalendar>
        </RekaDateRangePickerContent>
      </ThemeProvider>
    </RekaDateRangePickerRoot>
  </InputWrapper>
</template>
