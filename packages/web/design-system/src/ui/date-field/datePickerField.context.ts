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

import type { DatePickerFieldStyle } from '@/ui/date-field/datePickerField.style'

interface DatePickerFieldContext {
  datePickerStyle: ComputedRef<DatePickerFieldStyle>
  placeholder: Ref<CalendarDate>
  setPlaceholder: (date: CalendarDate) => void
  onClose: () => void
}

export const datePickerFieldContextKey: InjectionKey<DatePickerFieldContext> = Symbol('DatePickerFieldContextKey')

export function useProvideDatePickerFieldContext(context: DatePickerFieldContext): void {
  provide(datePickerFieldContextKey, context)
}

export function useInjectDatePickerFieldContext(): DatePickerFieldContext {
  const context = inject(datePickerFieldContextKey, null)

  if (context === null) {
    throw new Error('DatePickerFieldContext not provided')
  }

  return context
}
