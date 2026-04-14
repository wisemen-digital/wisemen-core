import type { TooltipProps } from '@/ui/tooltip/tooltip.props'

export interface ActionTooltipProps extends Pick<TooltipProps, 'disableCloseOnTriggerClick' | 'isDisabled' | 'popoverAlign' | 'popoverSide'> {
  /**
   * Visual representation of a keyboard shortcut (e.g. "⌘K", "Ctrl+S").
   * @default null
   */
  keyboardShortcut?: string | null
  /**
   * The text label displayed inside the tooltip.
   * @default null
   */
  label?: string | null
}
