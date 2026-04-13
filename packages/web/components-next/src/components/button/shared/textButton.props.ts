import type { CustomizableElement } from '@/class-variant/classVariant.type'
import type { SharedButtonProps } from '@/components/button/shared/sharedButton.props'
import type { Icon } from '@/icons/icons'

export interface TextButtonProps extends SharedButtonProps, CustomizableElement<'button'> {
  /**
   * The icon displayed on the left side of the button text. If set to null, no left icon will be shown.
   * @default null
   */
  iconLeft?: Icon | null
  /**
   * The icon displayed on the right side of the button text. If set to null, no right icon will be shown.
   * @default null
   */
  iconRight?: Icon | null

}
