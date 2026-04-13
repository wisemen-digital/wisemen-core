import type { ComputedRef } from 'vue'

import type { ResolvedClassConfig } from '@/class-variant/classVariant.type'
import type { CheckboxProps } from '@/components/checkbox/checkbox.props'
import type { CreateCheckboxStyle } from '@/components/checkbox/checkbox.style'
import { useContext } from '@/composables/context/context.composable'
import type { PropsToComputed } from '@/utils/props.util'

interface CheckboxContext extends PropsToComputed<CheckboxProps> {
  customClassConfig: ComputedRef<ResolvedClassConfig<'checkbox'>>
  style: ComputedRef<CreateCheckboxStyle>
}

export const [
  useProvideCheckboxContext,
  useInjectCheckboxContext,
] = useContext<CheckboxContext>('checkboxContext')
