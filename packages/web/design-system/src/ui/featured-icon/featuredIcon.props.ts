import type { Component } from 'vue'

export type FeaturedIconColor = 'blue' | 'brand' | 'error' | 'gray' | 'pink' | 'purple' | 'success' | 'warning'
export type FeaturedIconSize = '2xl' | 'lg' | 'md' | 'sm' | 'xl'
export type FeaturedIconVariant = 'outline' | 'translucent'

export interface FeaturedIconProps {
  /**
   * The color of the featured icon.
   * @default 'gray'
   */
  color?: FeaturedIconColor
  /**
   * The icon component to display.
   */
  icon: Component
  /**
   * The size of the featured icon. `md` = 30px.
   * @default 'md'
   */
  size?: FeaturedIconSize
  /**
   * The visual style variant.
   * @default 'translucent'
   */
  variant?: FeaturedIconVariant
}
