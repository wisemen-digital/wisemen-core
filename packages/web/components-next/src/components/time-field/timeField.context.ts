import type { Temporal } from 'temporal-polyfill'
import type {
  ComputedRef,
  Ref,
} from 'vue'

import type { ResolvedClassConfig } from '@/class-variant/classVariant.type'
import type { TimeFieldProps } from '@/components/time-field/timeField.props'
import type { CreateTimeFieldStyle } from '@/components/time-field/timeField.style'
import { useContext } from '@/composables/context/context.composable'
import type { PropsToComputed } from '@/utils/props.util'

interface TimeFieldContext extends PropsToComputed<TimeFieldProps> {
  customClassConfig: ComputedRef<ResolvedClassConfig<'timeField'>>
  modelValue: Ref<Temporal.PlainTime | null>
  style: ComputedRef<CreateTimeFieldStyle>
  onBlur: (event: FocusEvent) => void
  onFocus: (event: FocusEvent) => void
}

export const [
  useProvideTimeFieldContext,
  useInjectTimeFieldContext,
] = useContext<TimeFieldContext>('timeFieldContext')
