import type { Temporal } from 'temporal-polyfill'
import type {
  ComputedRef,
  Ref,
} from 'vue'

import type { ResolvedClassConfig } from '@/class-variant/classVariant.type'
import type { DatePickerProps } from '@/components/date-picker/single/datePicker.props'
import type { CreateDatePickerStyle } from '@/components/date-picker/single/datePicker.style'
import { useContext } from '@/composables/context/context.composable'
import type { PropsToComputed } from '@/utils/props.util'

interface DatePickerContext extends PropsToComputed<DatePickerProps> {
  customClassConfig: ComputedRef<ResolvedClassConfig<'datePicker'>>
  modelValue: Ref<Temporal.PlainDate | null>
  placeholderValue: Ref<Temporal.PlainDate>
  style: ComputedRef<CreateDatePickerStyle>
}

export const [
  useProvideDatePickerContext,
  useInjectDatePickerContext,
] = useContext<DatePickerContext>('datePickerContext')
