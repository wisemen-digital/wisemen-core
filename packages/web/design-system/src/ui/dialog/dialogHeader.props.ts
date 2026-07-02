import type { Component } from 'vue'

export interface DialogHeaderProps {
  /**
   * The title text displayed in the header.
   */
  title: string

  /**
   * Whether to show the divider at the bottom of the header.
   * @default true
   */
  hasSeparator?: boolean

  /**
   * Whether to hide the description visually
   * @default false
   */
  isDescriptionHidden?: boolean

  /**
   * Description text displayed below the title. Can be hidden by setting `isDescriptionHidden` to `true`
   */
  description: string

  /**
   * Optional featured icon component displayed at the start of the header.
   */
  icon?: Component | null

  /**
   * Color variant applied to the icon container and icon itself.
   * @default 'brand'
   */
  iconVariant?: 'brand' | 'error' | 'success' | 'warning'
}
