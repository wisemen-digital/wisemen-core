import type { CalendarDate } from '@internationalized/date'
import type { PlainDate } from '@wisemen/vue-core-dates'
import type { DateRange } from 'reka-ui'
import type {
  InjectionKey,
  Ref,
} from 'vue'
import {
  inject,
  provide,
} from 'vue'

interface DateRangeFieldContext {
  isInvalidRange: Ref<boolean>
  draftValue: Ref<DateRange>
  placeholder: Ref<CalendarDate>
  setPlaceholder: (date: CalendarDate) => void
  setPreset: (range: {
    from: PlainDate
    until: PlainDate
  } | null) => void
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
