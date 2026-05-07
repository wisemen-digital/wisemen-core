import type { CalendarDate } from '@internationalized/date'
import type {
  ComputedRef,
  Ref,
} from 'vue'

import { useContext } from '@/composables/context.composable'
import type { DatePickerFieldStyle } from '@/ui/date-field/datePickerField.style'

interface DatePickerContext {
  datePickerStyle: ComputedRef<DatePickerFieldStyle>
  placeholder: Ref<CalendarDate>
  setPlaceholder: (date: CalendarDate) => void
  onClose?: () => void
}

export const [
  useProvideDatePickerContext,
  useInjectDatePickerContext,
] = useContext<DatePickerContext>('DatePickerContext')
