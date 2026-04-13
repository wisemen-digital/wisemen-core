import type { Component } from 'vue'
import type { RouteLocationRaw } from 'vue-router'

export interface LinkProps {
  /**
   * Icon displayed before the button label.
   * @default null
   */
  iconLeft?: Component | null
  /**
   * Icon displayed after the button label.
   * @default null
   */
  iconRight?: Component | null
  /**
   * Visual representation of a keyboard shortcut (e.g. "⌘K", "Ctrl+S").
   *
   * This is purely presentational and does not implement or bind
   * any keyboard shortcut behavior.
   *
   * @default null
   */
  keyboardShortcut?: string | null
  /**
   * Text label displayed inside the button.
   */
  label: string
  /**
   * The link attributes when using a standard anchor link.
   * @default null
   */
  link?: {
    href: string
    rel?: string
    target?: '_blank' | '_parent' | '_self' | '_top'
  } | null
  /**
   * Controls the button size.
   * @default 'md'
   */
  size?: 'lg' | 'md' | 'sm' | 'xs'
  /**
   * The link destination. Uses Vue Router's `router-link` when provided.
   * @default null
   */
  to?: RouteLocationRaw | null
  /**
   * Tooltip text shown on hover or focus.
   * @default null
   */
  tooltipLabel?: string | null
  /**
   * Position of the tooltip relative to the link.
   * @default 'top'
   */
  tooltipSide?: 'bottom' | 'left' | 'right' | 'top'
  /**
   * Visual style variant of the button.
   * @default 'primary'
   */
  variant?: 'destructive-primary' | 'destructive-tertiary' | 'primary' | 'secondary' | 'tertiary'
}
