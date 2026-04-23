import type { CalendarDate } from '@internationalized/date'
import type {
  ComputedRef,
  InjectionKey,
  Ref,
} from 'vue'
import {
  inject,
  provide,
} from 'vue'

import type { DatePickerStyle } from '@/ui/date-picker/datePicker.style'

interface DatePickerContext {
  datePickerStyle: ComputedRef<DatePickerStyle>
  placeholder: Ref<CalendarDate>
  setPlaceholder: (date: CalendarDate) => void
  onClose: () => void
}

export const datePickerContextKey: InjectionKey<DatePickerContext> = Symbol('DatePickerContextKey')

export function useProvideDatePickerContext(context: DatePickerContext): void {
  provide(datePickerContextKey, context)
}

export function useInjectDatePickerContext(): DatePickerContext {
  const context = inject(datePickerContextKey, null)

  if (context === null) {
    throw new Error('DatePickerContext not provided')
  }

  return context
}
