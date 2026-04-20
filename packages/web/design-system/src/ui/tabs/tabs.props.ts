import type { Component } from 'vue'
import type { RouteLocationRaw } from 'vue-router'

import type { DisabledWithReason } from '@/types/disabledWithReason.type'

export type TabsVariant = 'button-border' | 'button-brand' | 'underline'
export type TabsHorizontalListPadding = 'lg' | 'md' | 'none' | 'sm' | 'xl'

export interface TabsProps {
  /**
   * Whether the tabs should stretch to fill the full width of the container.
   * @default false
   */
  isFullWidth?: boolean
  /**
   * Defines the orientation of the tabs.
   * @default 'horizontal'
   */
  orientation?: 'horizontal' | 'vertical'

  /**
   * Controls the horizontal padding of the scroll container. Only applies to the `underline` variant.
   */
  underlineTabsHorizontalListPadding?: TabsHorizontalListPadding
  /**
   * Defines the visual style of the tabs.
   * @default 'underline'
   */
  variant?: TabsVariant
}

export interface TabsItemProps extends DisabledWithReason {
  /**
   * Whether the label is visually hidden but still accessible to screen readers.
   * @default false
   */
  isLabelHidden?: boolean
  /**
   * A count to display as a badge on the right side of the tab.
   */
  count?: number | null
  /**
   * Provides a reason why the tab is disabled,
   * when provided a tooltip will be shown on hover with the provided text.
   * @default null
   */
  disabledReason?: string | null
  /**
   * An optional icon to be displayed alongside the tab label.
   */
  icon?: Component
  /**
   * The label text for the tab.
   */
  label: string
  /**
   * Unique identifier for the tab item.
   */
  value: string
}

export interface TabsContentProps {
  /**
   * The value corresponding to a specific tab item.
   * It determines which content is displayed when a tab is selected.
   */
  value: string
}

export interface TabsRouterLinkItemProps extends DisabledWithReason {
  /**
   * Whether the label is visually hidden but still accessible to screen readers.
   * @default false
   */
  isLabelHidden?: boolean
  /**
   * A count to display as a badge on the right side of the tab.
   */
  count?: number | null
  /**
   * Provides a reason why the tab is disabled,
   * when provided a tooltip will be shown on hover with the provided text.
   * @default null
   */
  disabledReason?: string | null
  /**
   * An optional icon to be displayed alongside the tab label.
   */
  icon?: Component
  /**
   * The label text for the tab.
   */
  label: string
  /**
   * The route location to navigate to when the tab is clicked.
   */
  to: RouteLocationRaw
}
