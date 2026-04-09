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

interface DateRangePickerContext {
  draftValue: Ref<DateRange>
  setPreset: (range: { end: Temporal.PlainDate
    start: Temporal.PlainDate } | null) => void
  onApply: () => void
  onCancel: () => void
}

export const dateRangePickerContextKey: InjectionKey<DateRangePickerContext> = Symbol('DateRangePickerContextKey')

export function useProvideDateRangePickerContext(context: DateRangePickerContext): void {
  provide(dateRangePickerContextKey, context)
}

export function useInjectDateRangePickerContext(): DateRangePickerContext {
  const context = inject(dateRangePickerContextKey, null)

  if (context === null) {
    throw new Error('DateRangePickerContext not provided')
  }

  return context
}
