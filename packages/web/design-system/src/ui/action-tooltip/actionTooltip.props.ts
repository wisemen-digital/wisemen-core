import type { WithKeyboardShortcut } from '@/types/withKeyboardShortcut.type'
import type { TooltipProps } from '@/ui/tooltip/tooltip.props'

export interface ActionTooltipProps extends Pick<TooltipProps, 'isCloseOnTriggerClickDisabled' | 'isDisabled' | 'popoverAlign' | 'popoverSide'>, WithKeyboardShortcut {
  /**
   * @deprecated Use `isCloseOnTriggerClickDisabled` instead.
   */
  disableCloseOnTriggerClick?: boolean

  /**
   * The text label displayed inside the tooltip.
   * @default null
   */
  label?: string | null
}
