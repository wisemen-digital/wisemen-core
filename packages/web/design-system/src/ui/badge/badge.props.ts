import type { Action } from '@wisemen/vue-core-actions'
import type { Component } from 'vue'

import type { RegisteredActionContext } from '@/register'

export type BadgeColor = 'blue' | 'brand' | 'error' | 'gray' | 'moss' | 'neutral' | 'pink' | 'purple' | 'success' | 'warning'

export interface BadgeAvatarConfig {
  /**
   * The name used to generate fallback initials.
   */
  name: string
  /**
   * The image source URL.
   */
  src?: string | null
}

export interface BadgeDotConfig {
  /**
   * The color of the dot. When not provided, the dot inherits the badge color.
   */
  color?: BadgeColor
}

/**
 * Structured content displayed on the left of the label, mirroring `MenuItemConfig.left`.
 */
export type BadgeLeftConfig
  = { color?: BadgeColor
    icon: Component
    type: 'icon' }
    | { color?: BadgeColor
      type: 'dot' }
      | { name: string
        src?: string | null
        type: 'avatar' }

export interface BadgeProps {
  /**
   * Whether the badge is disabled. Purely presentational — dims the badge and suppresses
   * the actions hover overlay. Badges are not interactive, so there is no `disabledReason`.
   *
   * @default false
   */
  isDisabled?: boolean
  /**
   * An array of actions to display in a dropdown menu. When provided, a 3-dots icon button
   * appears absolutely positioned on the right of the badge.
   */
  actions?: Action[] | null
  /**
   * Accessible label for screen readers. Use when the badge content alone is not descriptive enough.
   */
  ariaLabel?: string | null
  /**
   * An avatar configuration object. When provided, renders an avatar (xxs size) inside the badge.
   *
   * @deprecated Use `left` instead.
   */
  avatar?: BadgeAvatarConfig | null
  /**
   * The background color of the badge.
   */
  color?: BadgeColor
  /**
   * A dot configuration object. When provided, a dot indicator is shown inside the badge.
   * Pass an empty object `{}` to show a dot that inherits the badge color.
   *
   * @deprecated Use `left` instead.
   */
  dot?: BadgeDotConfig | null
  /**
   * An icon component to display inside the badge.
   *
   * @deprecated Use `left` instead.
   */
  icon?: Component | null
  /**
   * The color of the icon. Overrides the color otherwise derived from `color`/`variant`.
   * Only applies to the deprecated `icon` prop — for `left`, set `color` on the icon config itself.
   */
  iconColor?: BadgeColor
  /**
   * The text label displayed inside the badge.
   */
  label?: string | null
  /**
   * Content displayed on the left of the label. Supersedes `icon`, `dot`, and `avatar` when set.
   */
  left?: BadgeLeftConfig | null
  /**
   * Arbitrary metadata passed to the action context.
   */
  metadata?: RegisteredActionContext['metadata'] | null
  /**
   * The models passed to the action context.
   */
  models?: RegisteredActionContext['models'] | null
  /**
   * The border radius of the badge.
   */
  rounded?: 'default' | 'full'
  /**
   * The size of the badge.
   */
  size?: 'lg' | 'md' | 'sm'
  /**
   * The visual style variant of the badge.
   *
   * `'outline'` is deprecated — prefer `'solid'` or `'translucent'`.
   */
  variant?: 'outline' | 'solid' | 'translucent'
}
