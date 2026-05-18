import { CalendarDate } from '@internationalized/date'
import type { PlainDate } from '@wisemen/vue-core-dates'
import type { DateValue } from 'reka-ui'
import { Temporal } from 'temporal-polyfill'
import type { Ref } from 'vue'
import {
  computed,
  shallowRef,
} from 'vue'

import { useInjectConfigContext } from '@/ui/config-provider/config.context'

interface UseDatePickerOptions {
  maxDate: Ref<PlainDate | null>
  minDate: Ref<PlainDate | null>
  modelValue: Ref<PlainDate | null>
}

export function useDatePicker({
  maxDate,
  minDate,
  modelValue,
}: UseDatePickerOptions) {
  const {
    locale: configLocale,
  } = useInjectConfigContext()

  const locale = computed<string>(() => configLocale.value ?? navigator.language)

  const todayDate = Temporal.Now.plainDateISO()
  const calendarPlaceholder = shallowRef<CalendarDate>(
    new CalendarDate(todayDate.year, todayDate.month, todayDate.day),
  )

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
    plainDateToCalendarDate,
    calendarPlaceholder,
    calendarValue,
    locale,
    maxDateValue,
    minDateValue,
    setPlaceholder,
  }
}
