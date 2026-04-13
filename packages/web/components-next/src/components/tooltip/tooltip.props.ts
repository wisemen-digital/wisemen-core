import type {
  CustomizableElement,
  GetComponentProp,
} from '@/class-variant/classVariant.type'
import type { PopperPropsWithArrowVisibleByDefault } from '@/types/popperProps.type'
import type { TestId } from '@/utils/props.util'

export interface TooltipProps extends PopperPropsWithArrowVisibleByDefault, TestId, CustomizableElement<'tooltip'> {
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
  /**
   * Defines the visual style of the tooltip.
   */
  variant?: GetComponentProp<'tooltip', 'variant'> | null
}
