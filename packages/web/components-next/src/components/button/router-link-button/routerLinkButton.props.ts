import type { GetComponentProp } from '@/class-variant/classVariant.type'
import type { TextButtonProps } from '@/components/button/shared/textButton.props'
import type { Routes } from '@/types/routes.type'

export interface RouterLinkButtonProps extends Omit<TextButtonProps, 'isDisabled' | 'isLoading' | 'type'> {
  /**
   * Defines the button’s size.
   * @default 'md'
   */
  size?: GetComponentProp<'button', 'size'>
  /**
   * The route to navigate to when the button is clicked.
   */
  // @ts-expect-error no matching signature
  to: Routes[number]
  /**
   * Defines the visual style of the button.
   * @default 'primary'
   */
  variant?: GetComponentProp<'routerLinkButton', 'variant'>
}
