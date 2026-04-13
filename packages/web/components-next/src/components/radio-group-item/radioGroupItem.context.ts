import type { ComputedRef } from 'vue'

import type { ResolvedClassConfig } from '@/class-variant/classVariant.type'
import type { RadioGroupItemProps } from '@/components/radio-group-item/radioGroupItem.props'
import type { CreateRadioGroupItemStyle } from '@/components/radio-group-item/radioGroupItem.style'
import { useContext } from '@/composables/context/context.composable'
import type { PropsToComputed } from '@/utils/props.util'

interface RadioGroupItemContext extends PropsToComputed<RadioGroupItemProps> {
  customClassConfig: ComputedRef<ResolvedClassConfig<'radioGroupItem'>>
  style: ComputedRef<CreateRadioGroupItemStyle>
}

export const [
  useProvideRadioGroupItemContext,
  useInjectRadioGroupItemContext,
] = useContext<RadioGroupItemContext>('radioGroupItemContext')
