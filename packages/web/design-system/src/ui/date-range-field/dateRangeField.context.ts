import type { CalendarDate } from '@internationalized/date'
import type { DateRange } from 'reka-ui'
import type { Temporal } from 'temporal-polyfill'
import type { Ref } from 'vue'

import { useContext } from '@/composables/context.composable'

interface DateRangeFieldContext {
  isInvalidRange: Ref<boolean>
  draftValue: Ref<DateRange>
  placeholder: Ref<CalendarDate>
  setPlaceholder: (date: CalendarDate) => void
  setPreset: (range: { end: Temporal.PlainDate
    start: Temporal.PlainDate } | null) => void
  onCancel: () => void
}

export const [
  useProvideDateRangeFieldContext,
  useInjectDateRangeFieldContext,
] = useContext<DateRangeFieldContext>('dateRangeFieldContext')
