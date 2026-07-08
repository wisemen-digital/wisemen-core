import type { Component } from 'vue'
import type { RouteLocationNormalized } from 'vue-router'

import type { RegisteredRouteLocationRaw } from '@/register'
import type { WithKeyboardShortcut } from '@/types/withKeyboardShortcut.type'

export type MainSidebarCollapsedVariant = 'hidden' | 'minified'

export interface DashboardSidebarNavSubItem {
  /**
   * Text label for the sub-item
   */
  label: string
  /**
   * Route location to navigate to
   */
  to: RegisteredRouteLocationRaw
}

interface DashboardSidebarNavLinkBase extends WithKeyboardShortcut {
  /**
   * Optional function to determine if the link is active based on the current route
   */
  isActive?: (route: RouteLocationNormalized) => boolean
  /**
   * Icon component to display alongside the label
   */
  icon: Component
  /**
   * Text label for the navigation link
   */
  label: string
  /**
   * Optional callback function to execute on click, in addition to navigation
   */
  onClick?: () => void
}

export interface SidebarNavLinkItem extends DashboardSidebarNavLinkBase {
  /**
   * Route location to navigate to
   */
  to: RegisteredRouteLocationRaw
  type: 'link'

}

export interface SidebarNavSubItemsItem extends DashboardSidebarNavLinkBase {
  /**
   * 1-level-deep sub-items. When ≤3, rendered inline in expanded sidebar.
   * When >3 or sidebar is minified/floating, rendered in a popover.
   */
  subItems: DashboardSidebarNavSubItem[]
  type: 'sub-items'
}

export type DashboardSidebarNavLink = SidebarNavLinkItem | SidebarNavSubItemsItem

export interface DashboardSidebarGroup {
  /**
   * Optional label for the group
   */
  label?: string
  /**
   * Links within the group
   */
  links: DashboardSidebarNavLink[]
}
