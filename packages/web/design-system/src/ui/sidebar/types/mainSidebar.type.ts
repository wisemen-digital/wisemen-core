import type { Component } from 'vue'
import type {
  RouteLocationNormalized,
  RouteLocationRaw,
} from 'vue-router'

export type MainSidebarCollapsedVariant = 'hidden' | 'minified'

export interface DashboardSidebarNavLink {
  /**
   * Optional function to determine if the link is active based on the current route
   * @param route
   * @returns boolean indicating if the link is active
   */
  isActive?: (route: RouteLocationNormalized) => boolean
  /**
   * Icon component to display alongside the label
   */
  icon: Component
  /**
   * Optional keyboard shortcut hint to display next to the label
   * @default null
   */
  keyboardShortcut?: string | null

  /**
   * Text label for the navigation link
   */
  label: string

  /**
   * Route location to navigate to
   */
  to: RouteLocationRaw

  /**
   * Optional callback function to execute on click, in addition to navigation
   */
  onClick?: () => void
}

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
