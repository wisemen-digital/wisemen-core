import type {
  CustomizableElement,
  GetComponentProp,
} from '@/class-variant/classVariant.type'
import type { PopperPropsWithArrowVisibleByDefault } from '@/types/popperProps.type'
import type { TestId } from '@/utils/props.util'

export interface PopoverProps extends TestId, PopperPropsWithArrowVisibleByDefault, CustomizableElement<'popover'> {
  /**
   * Defines the visual style of the popover.
   */
  variant?: GetComponentProp<'popover', 'variant'> | null
}
