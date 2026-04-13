import type { ComputedRef } from 'vue'

import type { ResolvedClassConfig } from '@/class-variant/classVariant.type'
import type { NumberFieldProps } from '@/components/number-field/numberField.props'
import type { CreateNumberFieldStyle } from '@/components/number-field/numberField.style'
import { useContext } from '@/composables/context/context.composable'
import type { PropsToComputed } from '@/utils/props.util'

interface NumberFieldContext extends PropsToComputed<NumberFieldProps> {
  customClassConfig: ComputedRef<ResolvedClassConfig<'numberField'>>
  style: ComputedRef<CreateNumberFieldStyle>
  onBlur: (event: FocusEvent) => void
  onFocus: (event: FocusEvent) => void
}

export const [
  useProvideNumberFieldContext,
  useInjectNumberFieldContext,
] = useContext<NumberFieldContext>('numberFieldContext')
