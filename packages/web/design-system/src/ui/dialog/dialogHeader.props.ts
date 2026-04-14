import type { Component } from 'vue'

export interface DialogHeaderProps {
  /**
   * The title text displayed in the header.
   */
  title: string

  /**
   * Optional description text displayed below the title.
   */
  description?: string | null

  /**
   * Optional featured icon component displayed at the start of the header.
   */
  icon?: Component | null

  /**
   * Color variant applied to the icon container and icon itself.
   * @default 'brand'
   */
  iconVariant?: 'brand' | 'error' | 'success' | 'warning'

  /**
   * Whether to show the divider at the bottom of the header.
   * @default true
   */
  showSeparator?: boolean
}
