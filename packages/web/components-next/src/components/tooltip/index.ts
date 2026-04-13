import type { TooltipProps } from '@/components/tooltip/tooltip.props'

export { useInjectToastContext } from '@/components/toast/toast.context'
export { default as VcTooltipArrow } from '@/components/tooltip/parts/TooltipArrow.vue'
export { default as VcTooltipContent } from '@/components/tooltip/parts/TooltipContent.vue'
export { default as VcTooltipContentTransition } from '@/components/tooltip/parts/TooltipContentTransition.vue'
export { default as VcTooltipInnerContent } from '@/components/tooltip/parts/TooltipInnerContent.vue'
export { default as VcTooltipPortal } from '@/components/tooltip/parts/TooltipPortal.vue'
export { default as VcTooltipRoot } from '@/components/tooltip/parts/TooltipRoot.vue'
export { default as VcTooltipTrigger } from '@/components/tooltip/parts/TooltipTrigger.vue'
export type VcTooltipProps = Omit<TooltipProps, 'classConfig' | 'variant'>
export { createTooltipStyle } from '@/components/tooltip/tooltip.style'
export { default as VcTooltip } from '@/components/tooltip/Tooltip.vue'
export { default as VcTooltipProvider } from '@/components/tooltip/TooltipProvider.vue'
