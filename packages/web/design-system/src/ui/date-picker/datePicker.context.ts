import type { InjectionKey } from 'vue'
import {
  inject,
  provide,
} from 'vue'

interface DatePickerContext {
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
