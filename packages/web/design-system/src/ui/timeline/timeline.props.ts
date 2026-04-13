import type { Component } from 'vue'

export type TimelineVariant = 'outline' | 'solid' | 'subtle'

export type TimelineSize = 'md' | 'sm'

export interface TimelineProps {
  /**
   * Defines the size of the timeline indicators and connectors.
   * @default 'md'
   */
  size?: TimelineSize
  /**
   * Defines the visual style of the timeline indicators.
   * @default 'solid'
   */
  variant?: TimelineVariant
}

export interface TimelineItemProps {
  /**
   * Whether this is the last item in the timeline.
   * Hides the connector line below the indicator.
   * @default false
   */
  isLast?: boolean
  /**
   * An optional icon to be displayed inside the indicator.
   */
  icon?: Component

}
