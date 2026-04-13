import type { AvatarProps } from '@/ui/avatar/avatar/avatar.props'

export interface AvatarLabelProps extends AvatarProps {
  /**
   * Supporting text displayed below the name.
   * @default null
   */
  supportingText?: string | null
}

export const AVATAR_LABEL_DEFAULTS: AvatarLabelProps = {
  name: '',
  logo: null,
  logoAlt: null,
  size: 'md',
  src: null,
  status: null,
  supportingText: null,
}
