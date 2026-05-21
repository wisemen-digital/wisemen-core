import type { DateValue } from '@internationalized/date'
import { CalendarDate } from '@internationalized/date'
import { useBreakpoints } from '@vueuse/core'
import type {
  PlainDate,
  PlainDateRange,
} from '@wisemen/vue-core-dates'
import type { DateRange } from 'reka-ui'
import { Temporal } from 'temporal-polyfill'
import type { Ref } from 'vue'
import {
  computed,
  ref,
  shallowRef,
  watch,
} from 'vue'

interface UseDateRangePickerOptions {
  maxDate: Ref<PlainDate | null>
  minDate: Ref<PlainDate | null>
  modelValue: Ref<PlainDateRange>
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
  const initialDate = modelValue.value.from ?? todayDate
  const calendarPlaceholder = shallowRef<CalendarDate>(
    new CalendarDate(initialDate.year, initialDate.month, 1),
  )
  const draftValue = shallowRef<DateRange>({
    end: modelValue.value?.until != null ? plainDateToCalendarDate(modelValue.value.until) : undefined,
    start: modelValue.value?.from != null ? plainDateToCalendarDate(modelValue.value.from) : undefined,
  })

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

  function plainDateToCalendarDate(date: PlainDate): CalendarDate {
    return new CalendarDate(date.year, date.month, date.day)
  }

  function calendarDateToPlainDate(date: DateValue): PlainDate {
    return Temporal.PlainDate.from({
      day: date.day,
      month: date.month,
      year: date.year,
    })
  }

  watch(draftValue, (value) => {
    if (value.start != null && value.end != null) {
      modelValue.value = {
        from: calendarDateToPlainDate(value.start),
        until: calendarDateToPlainDate(value.end),
      }
    }
    else if (value.start == null && value.end == null) {
      modelValue.value = {
        from: null,
        until: null,
      }
    }
  }, {
    deep: true,
  })

  function setPreset(range: { from: PlainDate
    until: PlainDate } | null): void {
    if (range === null) {
      draftValue.value = {
        end: undefined,
        start: undefined,
      }
    }
    else {
      draftValue.value = {
        end: plainDateToCalendarDate(range.until),
        start: plainDateToCalendarDate(range.from),
      }
    }
  }

  function syncDraftFromModel(): void {
    const start = modelValue.value?.from != null ? plainDateToCalendarDate(modelValue.value.from) : undefined
    const end = modelValue.value?.until != null ? plainDateToCalendarDate(modelValue.value.until) : undefined

    const startChanged = start == null
      ? draftValue.value.start != null
      : draftValue.value.start == null || start.compare(draftValue.value.start) !== 0

    const endChanged = end == null
      ? draftValue.value.end != null
      : draftValue.value.end == null || end.compare(draftValue.value.end) !== 0

    if (!startChanged && !endChanged) {
      return
    }

    draftValue.value = {
      end,
      start,
    }
  }

  watch(modelValue, syncDraftFromModel)

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
