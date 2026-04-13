import type { Temporal } from 'temporal-polyfill'
import type {
  ComputedRef,
  Ref,
} from 'vue'

import type { ResolvedClassConfig } from '@/class-variant/classVariant.type'
import type { DateRangePickerProps } from '@/components/date-picker/range/dateRangePicker.props'
import type { CreateDateRangePickerStyle } from '@/components/date-picker/range/dateRangePicker.style'
import { useContext } from '@/composables/context/context.composable'
import type { DateRange } from '@/types/dateRange.type'
import type { PropsToComputed } from '@/utils/props.util'

interface DateRangePickerContext extends PropsToComputed<DateRangePickerProps> {
  customClassConfig: ComputedRef<ResolvedClassConfig<'dateRangePicker'>>
  modelValue: Ref<DateRange<Temporal.PlainDate>>
  placeholderValue: Ref<Temporal.PlainDate>
  style: ComputedRef<CreateDateRangePickerStyle>

}

export const [
  useProvideDateRangePickerContext,
  useInjectDateRangePickerContext,
] = useContext<DateRangePickerContext>('dateRangePickerContext')
