import type { Component } from 'vue'

import type { DotColor } from '@/ui/dot/dot.props'

export interface TabsItemLeftConfig {
  icon: Component
  type: 'icon'
}

export type TabsItemIndicatorConfig
  = {
    /**
     * The color of the dot.
     * @default 'error'
     */
    color?: DotColor
    type: 'dot'
  }
  | {
    type: 'count'
    /**
     * The number to display inside the badge.
     */
    value: number
  }

export interface TabsItemConfig {
  /**
   * An indicator displayed on the right side of the tab.
   * Supports a dot (e.g. to flag a form error) or a count badge. Supersedes `count` when set.
   */
  indicator?: TabsItemIndicatorConfig | null
  /**
   * Content displayed to the left of the label. Supersedes `icon` when set.
   */
  left?: TabsItemLeftConfig | null
}
