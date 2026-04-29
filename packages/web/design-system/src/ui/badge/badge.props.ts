import type { Component } from 'vue'

export type BadgeColor = 'blue' | 'brand' | 'error' | 'gray' | 'pink' | 'purple' | 'success' | 'warning'

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

export interface BadgeProps {
  /**
   * Accessible label for screen readers. Use when the badge content alone is not descriptive enough.
   */
  ariaLabel?: string | null
  /**
   * An avatar configuration object. When provided, renders an avatar (xxs size) inside the badge.
   */
  avatar?: BadgeAvatarConfig | null
  /**
   * The background color of the badge.
   */
  color?: BadgeColor
  /**
   * A dot configuration object. When provided, a dot indicator is shown inside the badge.
   * Pass an empty object `{}` to show a dot that inherits the badge color.
   */
  dot?: BadgeDotConfig | null
  /**
   * An icon component to display inside the badge.
   */
  icon?: Component | null
  /**
   * The text label displayed inside the badge.
   */
  label?: string | null
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
   */
  variant?: 'outline' | 'solid' | 'translucent'
}
