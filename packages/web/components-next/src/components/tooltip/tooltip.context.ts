import type { ComputedRef } from 'vue'

import type { ResolvedClassConfig } from '@/class-variant/classVariant.type'
import type { TooltipProps } from '@/components/tooltip/tooltip.props'
import type { CreateTooltipStyle } from '@/components/tooltip/tooltip.style'
import { useContext } from '@/composables/context/context.composable'
import type { PropsToComputed } from '@/utils/props.util'

interface TooltipContext extends PropsToComputed<TooltipProps> {
  isInitialAnimationEnabled: ComputedRef<boolean>
  isOpen: ComputedRef<boolean>
  customClassConfig: ComputedRef<ResolvedClassConfig<'tooltip'>>
  style: ComputedRef<CreateTooltipStyle>
}

export const [
  useProvideTooltipContext,
  useInjectTooltipContext,
] = useContext<TooltipContext>('tooltipContext')
