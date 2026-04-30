import type { DateValue } from '@internationalized/date'
import { CalendarDate } from '@internationalized/date'
import { useBreakpoints } from '@vueuse/core'
import type { DateRange } from 'reka-ui'
import { Temporal } from 'temporal-polyfill'
import type { Ref } from 'vue'
import {
  computed,
  ref,
  shallowRef,
  watch,
} from 'vue'

export interface DateRangeValue {
  end: Temporal.PlainDate | null
  start: Temporal.PlainDate | null
}

interface UseDateRangePickerOptions {
  maxDate: Ref<Temporal.PlainDate | null>
  minDate: Ref<Temporal.PlainDate | null>
  modelValue: Ref<DateRangeValue | null>
}

export function useDateRangePicker({
  maxDate,
  minDate,
  modelValue,
}: UseDateRangePickerOptions) {
  const locale = navigator.language

  const isInvalidRange = ref<boolean>(false)

  const screen = useBreakpoints({
    md: 768,
  })
  const isSingleMonth = screen.smaller('md')

  const todayDate = Temporal.Now.plainDateISO()
  const calendarPlaceholder = shallowRef<CalendarDate>(
    new CalendarDate(todayDate.year, todayDate.month, 1),

  )
  const draftValue = ref<DateRange>({
    end: modelValue.value?.end != null ? plainDateToCalendarDate(modelValue.value.end) : undefined,
    start: modelValue.value?.start != null ? plainDateToCalendarDate(modelValue.value.start) : undefined,
  }) as Ref<DateRange>

  function onDraftValueUpdate(value: DateRange): void {
    if (value.start != null && value.end != null && value.start.compare(value.end) > 0) {
      isInvalidRange.value = true

      return
    }

    isInvalidRange.value = false
    draftValue.value = value
  }

  function setPlaceholder(date: CalendarDate): void {
    calendarPlaceholder.value = date
  }

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

  function setPreset(range: { end: Temporal.PlainDate
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

  function syncDraftFromModel(): void {
    draftValue.value = {
      end: modelValue.value?.end != null ? plainDateToCalendarDate(modelValue.value.end) : undefined,
      start: modelValue.value?.start != null ? plainDateToCalendarDate(modelValue.value.start) : undefined,
    }
  }

  const minDateValue = computed<DateValue | undefined>(() => {
    if (minDate.value == null) {
      return
    }

    return plainDateToCalendarDate(minDate.value) as DateValue
  })

  const maxDateValue = computed<DateValue | undefined>(() => {
    if (maxDate.value == null) {
      return
    }

    return plainDateToCalendarDate(maxDate.value) as DateValue
  })

  return {
    isInvalidRange,
    isSingleMonth,
    calendarPlaceholder,
    draftValue,
    locale,
    maxDateValue,
    minDateValue,
    setPlaceholder,
    setPreset,
    syncDraftFromModel,
    onDraftValueUpdate,
  }
}
