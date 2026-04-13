import type { PopperProps } from '@/types/popper.type'

export interface TooltipProps extends PopperProps {
  /**
   * When true, the tooltip will be hidden.
   * @default false
   */
  isDisabled?: boolean
  /**
   * The duration in milliseconds to wait before showing the tooltip.
   * @default 0
   */
  delayDuration?: number
  /**
   * When true, clicking on trigger won’t close the tooltip.
   * @default false
   */
  disableCloseOnTriggerClick?: boolean
  /**
   * When true, trying to hover the content will result in the tooltip closing as the pointer leaves the trigger.
   * @default false
   */
  disableHoverableContent?: boolean
}
