import type { ComputedRef } from 'vue'

import type { ResolvedClassConfig } from '@/class-variant/classVariant.type'
import type { PopoverProps } from '@/components/popover/popover.props'
import type { CreatePopoverStyle } from '@/components/popover/popover.style'
import { useContext } from '@/composables/context/context.composable'
import type { PropsToComputed } from '@/utils/props.util'

interface PopoverContext extends PropsToComputed<PopoverProps> {
  isOpen: ComputedRef<boolean>
  customClassConfig: ComputedRef<ResolvedClassConfig<'popover'>>
  style: ComputedRef<CreatePopoverStyle>
  onAutoFocusOnClose: (event: Event) => void
  onContentEscapeKeyDown: (event: KeyboardEvent) => void
  onContentFocusOutside: (event: CustomEvent) => void
  onContentInteractOutside: (event: CustomEvent) => void
}

export const [
  useProvidePopoverContext,
  useInjectPopoverContext,
] = useContext<PopoverContext>('popoverContext')
