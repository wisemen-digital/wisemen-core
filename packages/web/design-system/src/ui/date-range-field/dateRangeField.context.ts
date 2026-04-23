import type { CalendarDate } from '@internationalized/date'
import type { DateRange } from 'reka-ui'
import type { Temporal } from 'temporal-polyfill'
import type {
  InjectionKey,
  Ref,
} from 'vue'
import {
  inject,
  provide,
} from 'vue'

interface DateRangeFieldContext {
  draftValue: Ref<DateRange>
  placeholder: Ref<CalendarDate>
  setPlaceholder: (date: CalendarDate) => void
  setPreset: (range: { end: Temporal.PlainDate
    start: Temporal.PlainDate } | null) => void
  onCancel: () => void
}

export const dateRangeFieldContextKey: InjectionKey<DateRangeFieldContext> = Symbol('DateRangeFieldContextKey')

export function useProvideDateRangeFieldContext(context: DateRangeFieldContext): void {
  provide(dateRangeFieldContextKey, context)
}

export function useInjectDateRangeFieldContext(): DateRangeFieldContext {
  const context = inject(dateRangeFieldContextKey, null)

  if (context === null) {
    throw new Error('DateRangeFieldContext not provided')
  }

  return context
}
