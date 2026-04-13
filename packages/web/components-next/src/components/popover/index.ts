import type { PopoverProps } from '@/components/popover/popover.props'

export { default as VcPopoverAnchor } from '@/components/popover/parts/PopoverAnchor.vue'
export { default as VcPopoverArrow } from '@/components/popover/parts/PopoverArrow.vue'
export { default as VcPopoverCloseButton } from '@/components/popover/parts/PopoverCloseButton.vue'
export { default as VcPopoverContent } from '@/components/popover/parts/PopoverContent.vue'
export { default as VcPopoverContentTransition } from '@/components/popover/parts/PopoverContentTransition.vue'
export { default as VcPopoverPortal } from '@/components/popover/parts/PopoverPortal.vue'
export { default as VcPopoverRoot } from '@/components/popover/parts/PopoverRoot.vue'
export { default as VcPopoverTrigger } from '@/components/popover/parts/PopoverTrigger.vue'
export type VcPopoverProps = Omit<PopoverProps, 'classConfig' | 'variant'>
export { createPopoverStyle } from '@/components/popover/popover.style'
export { default as VcPopover } from '@/components/popover/Popover.vue'
