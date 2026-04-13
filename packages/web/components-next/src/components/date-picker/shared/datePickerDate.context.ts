import type { DateValue } from 'reka-ui'

import { useContext } from '@/composables/context/context.composable'

interface DatePickerDateContext {
  date: DateValue
  month: DateValue
}

export const [
  useProvideDatePickerDateContext,
  useInjectDatePickerDateContext,
] = useContext<DatePickerDateContext>(
  'useDatePickerDateContext',
)
