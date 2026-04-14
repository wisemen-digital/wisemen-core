import type { AvatarProps } from '@/ui/avatar/avatar/avatar.props'

export interface AvatarGroupProps {
  /**
   * The list of avatars to display.
   */
  avatars: AvatarProps[]
  /**
   * The maximum number of avatars to show before displaying a "+X" indicator.
   * @default 10
   */
  max?: number
  /**
   * The size of the avatars in the group.
   * @default 'sm'
   */
  size?: 'md' | 'sm' | 'xs'
}

export const AVATAR_GROUP_DEFAULTS: Partial<AvatarGroupProps> = {
  max: 10,
  size: 'sm',
}
