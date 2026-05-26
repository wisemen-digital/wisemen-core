import type { CalendarDate } from '@internationalized/date'
import type { PlainDate } from '@wisemen/vue-core-dates'
import type { DateRange } from 'reka-ui'
import type { Ref } from 'vue'

import { useContext } from '@/composables/context.composable'

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

export const [
  useProvideDateRangeFieldContext,
  useInjectDateRangeFieldContext,
] = useContext<DateRangeFieldContext>('dateRangeFieldContext')
