import type { GetComponentProp } from '@/class-variant/classVariant.type'
import type { TextButtonProps } from '@/components/button/shared/textButton.props'

export interface ButtonProps extends TextButtonProps {
  /**
   * Defines the button’s size.
   * @default 'md'
   */
  size?: GetComponentProp<'button', 'size'>
  /**
   * Defines the visual style of the button.
   * @default 'primary'
   */
  variant?: GetComponentProp<'button', 'variant'>
}
