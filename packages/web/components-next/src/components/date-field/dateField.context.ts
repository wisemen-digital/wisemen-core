import type { Temporal } from 'temporal-polyfill'
import type {
  ComputedRef,
  Ref,
} from 'vue'

import type { ResolvedClassConfig } from '@/class-variant/classVariant.type'
import type { DateFieldProps } from '@/components/date-field/dateField.props'
import type { CreateDateFieldStyle } from '@/components/date-field/dateField.style'
import { useContext } from '@/composables/context/context.composable'
import type { PropsToComputed } from '@/utils/props.util'

interface DateFieldContext extends PropsToComputed<DateFieldProps> {
  customClassConfig: ComputedRef<ResolvedClassConfig<'dateField'>>
  modelValue: Ref<Temporal.PlainDate | null>
  placeholderValue: Ref<Temporal.PlainDate>
  style: ComputedRef<CreateDateFieldStyle>
  onBlur: (event: FocusEvent) => void
  onFocus: (event: FocusEvent) => void
}

export const [
  useProvideDateFieldContext,
  useInjectDateFieldContext,
] = useContext<DateFieldContext>('dateFieldContext')
