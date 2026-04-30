<script setup lang="ts">
import type { DateValue } from '@internationalized/date'
import { CalendarDate } from '@internationalized/date'
import { useBreakpoints } from '@vueuse/core'
import {
  ArrowNarrowRightIcon,
  CalendarIcon,
} from '@wisemen/vue-core-icons'
import type { DateRange } from 'reka-ui'
import {
  DateRangePickerCalendar as RekaDateRangePickerCalendar,
  DateRangePickerContent as RekaDateRangePickerContent,
  DateRangePickerField as RekaDateRangePickerField,
  DateRangePickerInput as RekaDateRangePickerInput,
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
import { UIIconButton } from '@/ui/button'
import { useProvideDateRangeFieldContext } from '@/ui/date-range-field/dateRangeField.context'
import type { DateRangeFieldProps } from '@/ui/date-range-field/dateRangeField.props'
import { createDateRangeFieldStyle } from '@/ui/date-range-field/dateRangeField.style'
import DateRangeFieldCalendarGrid from '@/ui/date-range-field/DateRangeFieldCalendarGrid.vue'
import DateRangeFieldCalendarHeader from '@/ui/date-range-field/DateRangeFieldCalendarHeader.vue'
import DateRangeFieldInputRow from '@/ui/date-range-field/DateRangeFieldInputRow.vue'
import DateRangeFieldPresets from '@/ui/date-range-field/DateRangeFieldPresets.vue'
import FieldWrapper from '@/ui/field-wrapper/FieldWrapper.vue'
import InputWrapper from '@/ui/input-wrapper/InputWrapper.vue'
import ThemeProvider from '@/ui/theme-provider/ThemeProvider.vue'
import { getWeekStartsOn } from '@/utils/weekStartsOn.util'

defineOptions({
  inheritAttrs: false,
})

const props = withDefaults(defineProps<DateRangeFieldProps>(), {
  ...INPUT_DEFAULTS,
  ...INPUT_META_DEFAULTS,
  ...INPUT_FIELD_DEFAULTS,
  maxDate: null,
  minDate: null,
  isPickerHidden: false,
  placeholder: null,
  size: 'md',
})

export interface DateRangeFieldRange {
  end: Temporal.PlainDate | null
  start: Temporal.PlainDate | null
}

const modelValue = defineModel<DateRangeFieldRange | null>({
  required: true,
})

const {
  t,
} = useI18n()

const locale = navigator.language

const id = props.id ?? useId()

const attrs = useAttrs()

const {
  isError,
  ariaDescribedBy,
  ariaInvalid,
} = useInput(id, props)

const screen = useBreakpoints({
  md: 768,
})

const isSingleMonth = screen.smaller('md')

const isOpen = ref(false)
const dateRangeFieldStyle = computed(() => createDateRangeFieldStyle({
  isPickerHidden: props.isPickerHidden,
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

const isInvalidRange = ref<boolean>(false)

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

watch(draftValue, (value) => {
  if (value.start != null && value.end != null) {
    modelValue.value = {
      end: calendarDateToPlainDate(value.end),
      start: calendarDateToPlainDate(value.start),
    }
  }
  else if (value.start == null && value.end == null) {
    modelValue.value = null
  }
}, {
  deep: true,
})

function onDraftValueUpdate(value: DateRange): void {
  if (value.start != null && value.end != null && value.start.compare(value.end) > 0) {
    isInvalidRange.value = true

    return
  }

  isInvalidRange.value = false
  draftValue.value = value
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

useProvideDateRangeFieldContext({
  isInvalidRange,
  draftValue,
  placeholder: calendarPlaceholder,
  setPlaceholder: (date) => { calendarPlaceholder.value = date },
  setPreset,
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
      v-model:open="isOpen"
      v-model:placeholder="calendarPlaceholder"
      :model-value="draftValue"
      :week-starts-on="getWeekStartsOn(locale)"
      :disabled="props.isDisabled"
      :max-value="maxDateValue"
      :min-value="minDateValue"
      :readonly="props.isReadonly"
      :required="props.isRequired"
      :locale="locale"
      :number-of-months="isSingleMonth ? 1 : 2"
      :close-on-select="false"
      @update:model-value="onDraftValueUpdate"
    >
      <FieldWrapper
        :is-disabled="props.isDisabled"
        :is-error="isError"
        :is-loading="props.isLoading"
        :is-readonly="props.isReadonly"
        :size="props.size"
      >
        <RekaDateRangePickerField
          :id="id"
          v-slot="{ segments }"
          v-bind="attrs"
          :aria-describedby="ariaDescribedBy"
          :aria-invalid="ariaInvalid"
          :aria-required="props.isRequired || undefined"
          :class="dateRangeFieldStyle.field()"
        >
          <template
            v-for="{ part, value } in segments.start"
            :key="`start-${part}`"
          >
            <RekaDateRangePickerInput
              v-if="part !== 'literal'"
              :part="part"
              :class="dateRangeFieldStyle.segment()"
              type="start"
              data-field-wrapper
            >
              {{ value }}
            </RekaDateRangePickerInput>
            <RekaDateRangePickerInput
              v-else
              :part="part"
              :class="dateRangeFieldStyle.literal()"
              type="start"
            >
              {{ value }}
            </RekaDateRangePickerInput>
          </template>

          <ArrowNarrowRightIcon :class="dateRangeFieldStyle.separator()" />

          <template
            v-for="{ part, value } in segments.end"
            :key="`end-${part}`"
          >
            <RekaDateRangePickerInput
              v-if="part !== 'literal'"
              :part="part"
              :class="dateRangeFieldStyle.segment()"
              type="end"
              data-field-wrapper
            >
              {{ value }}
            </RekaDateRangePickerInput>
            <RekaDateRangePickerInput
              v-else
              :part="part"
              :class="dateRangeFieldStyle.literal()"
              type="end"
            >
              {{ value }}
            </RekaDateRangePickerInput>
          </template>
        </RekaDateRangePickerField>

        <template
          v-if="!props.isPickerHidden"
          #right
        >
          <RekaDateRangePickerTrigger :as-child="true">
            <UIIconButton
              :is-disabled="props.isDisabled || props.isReadonly"
              :is-tooltip-disabled="true"
              :icon="CalendarIcon"
              :label="t('component.date_range_picker.open')"
              size="xs"
              type="button"
              variant="tertiary"
              class="mr-xs"
              data-field-wrapper
            />
          </RekaDateRangePickerTrigger>
        </template>
      </FieldWrapper>

      <ThemeProvider :as-child="true">
        <RekaDateRangePickerContent
          :side-offset="4"
          :collision-padding="10"
          class="
            z-40 origin-(--reka-popover-content-transform-origin)
            will-change-[transform,opacity]
          "
          align="end"
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
              <DateRangeFieldPresets />

              <div class="flex min-w-0 flex-1 flex-col">
                <div class="flex">
                  <div class="flex flex-1 flex-col">
                    <DateRangeFieldCalendarHeader
                      :show-next="isSingleMonth"
                      side="left"
                    />
                    <div class="p-xl pt-0">
                      <DateRangeFieldCalendarGrid
                        :month="grid[0]"
                        :week-days="weekDays"
                      />
                    </div>
                  </div>

                  <template v-if="!isSingleMonth">
                    <div class="border-l border-secondary" />

                    <div class="flex flex-1 flex-col">
                      <DateRangeFieldCalendarHeader side="right" />
                      <div class="p-xl pt-0">
                        <DateRangeFieldCalendarGrid
                          :month="grid[1]"
                          :week-days="weekDays"
                        />
                      </div>
                    </div>
                  </template>
                </div>

                <DateRangeFieldInputRow />
              </div>
            </div>
          </RekaDateRangePickerCalendar>
        </RekaDateRangePickerContent>
      </ThemeProvider>
    </RekaDateRangePickerRoot>
  </InputWrapper>
</template>
