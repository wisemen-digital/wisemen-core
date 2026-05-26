import type { WithKeyboardShortcut } from '@/types/withKeyboardShortcut.type'
import type { TooltipProps } from '@/ui/tooltip/tooltip.props'

export interface ActionTooltipProps extends Pick<TooltipProps, 'disableCloseOnTriggerClick' | 'isDisabled' | 'popoverAlign' | 'popoverSide'>, WithKeyboardShortcut {
  /**
   * The text label displayed inside the tooltip.
   * @default null
   */
  label?: string | null
}
