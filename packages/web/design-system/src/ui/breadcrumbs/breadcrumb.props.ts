import type { Component } from 'vue'
import type { RouteLocationRaw } from 'vue-router'

export interface BreadcrumbItemProps {
  /**
   * Whether to visually hide the label while keeping it accessible to screen readers.
   */
  isLabelHidden?: boolean
  /**
   * An optional icon displayed before the label.
   */
  icon?: Component
  /**
   * The text label for the breadcrumb item.
   */
  label: string
  /**
   * The route location to navigate to when clicking the breadcrumb.
   * When not provided, the breadcrumb is rendered as plain text.
   */
  to?: RouteLocationRaw
}
