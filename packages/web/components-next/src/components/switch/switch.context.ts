import type { ComputedRef } from 'vue'

import type { ResolvedClassConfig } from '@/class-variant/classVariant.type'
import type { SwitchProps } from '@/components/switch/switch.props'
import type { CreateSwitchStyle } from '@/components/switch/switch.style'
import { useContext } from '@/composables/context/context.composable'
import type { PropsToComputed } from '@/utils/props.util'

interface SwitchContext extends PropsToComputed<SwitchProps> {
  isChecked: ComputedRef<boolean>
  customClassConfig: ComputedRef<ResolvedClassConfig<'switch'>>
  style: ComputedRef<CreateSwitchStyle>
}

export const [
  useProvideSwitchContext,
  useInjectSwitchContext,
] = useContext<SwitchContext>('switchContext')
