import type { Component } from 'vue'
import type {
  RouteLocationNormalized,
  RouteLocationRaw,
} from 'vue-router'

import type { WithKeyboardShortcut } from '@/types/withKeyboardShortcut.type'

export type MainSidebarCollapsedVariant = 'hidden' | 'minified'

export interface DashboardSidebarNavLink extends WithKeyboardShortcut {
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
