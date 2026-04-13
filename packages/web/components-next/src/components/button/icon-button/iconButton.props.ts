import type {
  CustomizableElement,
  GetComponentProp,
} from '@/class-variant/classVariant.type'
import type { SharedButtonProps } from '@/components/button/shared/sharedButton.props'
import type { Icon } from '@/icons/icons'

export interface IconButtonProps extends SharedButtonProps, CustomizableElement<'iconButton'> {
  /**
   * The icon to display inside the button.
   */
  icon: Icon
  /**
   * The label of the button used for screen readers.
   */
  label: string
  /**
   * Defines the button’s size.
   * @default 'md'
   */
  size?: GetComponentProp<'iconButton', 'size'>
  /**
   * Defines the visual style of the button.
   * @default 'primary'
   */
  variant?: GetComponentProp<'iconButton', 'variant'>
}
