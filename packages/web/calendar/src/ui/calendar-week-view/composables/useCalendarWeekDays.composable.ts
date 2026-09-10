import type { Temporal } from 'temporal-polyfill'
import type {
  ComputedRef,
  Ref,
} from 'vue'
import { computed } from 'vue'

export function useCalendarWeekDays(options: {
  currentDate: Ref<Temporal.PlainDate>
  firstDayOfWeek: Ref<0 | 1>
}): {
  weekDays: ComputedRef<Temporal.PlainDate[]>
} {
  const weekDays = computed<Temporal.PlainDate[]>(() => {
    const currentDate = options.currentDate.value
    const isoDayOfWeek = currentDate.dayOfWeek

    const sundayAdjustedDayIndex = options.firstDayOfWeek.value === 1
      ? isoDayOfWeek - 1
      : isoDayOfWeek % 7

    const startOfWeek = currentDate.subtract({
      days: sundayAdjustedDayIndex,
    })

    return Array.from({
      length: 7,
    }, (_, index) => startOfWeek.add({
      days: index,
    }))
  })

  return {
    weekDays,
  }
}
