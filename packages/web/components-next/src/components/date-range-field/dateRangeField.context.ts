import type { Temporal } from 'temporal-polyfill'
import type {
  ComputedRef,
  Ref,
} from 'vue'

import type { ResolvedClassConfig } from '@/class-variant/classVariant.type'
import type { DateRangeFieldProps } from '@/components/date-range-field/dateRangeField.props'
import type { CreateDateRangeFieldStyle } from '@/components/date-range-field/dateRangeField.style'
import { useContext } from '@/composables/context/context.composable'
import type { DateRange } from '@/types/dateRange.type'
import type { PropsToComputed } from '@/utils/props.util'

interface DateRangeFieldContext extends PropsToComputed<DateRangeFieldProps> {
  customClassConfig: ComputedRef<ResolvedClassConfig<'dateRangeField'>>
  modelValue: Ref<DateRange<Temporal.PlainDate>>
  placeholderValue: Ref<Temporal.PlainDate>
  style: ComputedRef<CreateDateRangeFieldStyle>
  onBlur: (event: FocusEvent) => void
  onFocus: (event: FocusEvent) => void
}

export const [
  useProvideDateRangeFieldContext,
  useInjectDateRangeFieldContext,
] = useContext<DateRangeFieldContext>('dateRangeFieldContext')
