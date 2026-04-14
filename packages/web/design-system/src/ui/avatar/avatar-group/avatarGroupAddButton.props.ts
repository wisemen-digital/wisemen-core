import type { IconButtonProps } from '@/ui/button/icon/iconButton.props'

export interface AvatarGroupAddButtonProps extends Omit<IconButtonProps, 'icon' | 'size' | 'variant'> {
  /**
   * Provides a reason why the button is disabled,
   * when provided a tooltip will be shown on hover with the provided text.
   * @default null
   */
  disabledReason?: string | null
  /**
   * The size of the add button. Should match the avatar group size.
   * @default 'sm'
   */
  size?: 'md' | 'sm' | 'xs'
}
