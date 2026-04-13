import type { Component } from 'vue'

export type BadgeColor = 'blue' | 'brand' | 'error' | 'gray' | 'pink' | 'pink' | 'purple' | 'success' | 'warning'

export interface BadgeProps {
  /**
   * Whether to display a dot indicator on the badge.
   */
  hasDot?: boolean
  /**
   * Accessible label for screen readers. Use when the badge content alone is not descriptive enough.
   */
  ariaLabel?: string | null
  /**
   * The background color of the badge.
   */
  color?: BadgeColor
  /**
   * The color of the dot indicator. When `null`, the dot inherits the badge color.
   */
  dotColor?: BadgeColor | null
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
