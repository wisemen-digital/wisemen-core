import type { Action } from '@wisemen/vue-core-actions'
import type { Component } from 'vue'

import type { ButtonProps } from '@/ui/button/button/button.props'
import type { LinkProps } from '@/ui/button/link/link.props'

export type EmptyStateIllustration = 'box' | 'cloud-search' | 'credit-card' | 'documents' | 'route-card'

export interface EmptyStateProps {
  /**
   * The title of the empty state.
   */
  title: string

  /**
   * The description of the empty state.
   * @default null
   */
  description?: string | null

  /**
   * The icon of the empty state. Ignored when `illustration` is set.
   * @default null
   */
  icon?: Component | null

  /**
   * An illustration to display. Takes priority over `icon` when both are set.
   * @default null
   */
  illustration?: EmptyStateIllustration | null

  /**
   * The primary action of the empty state.
   */
  primaryAction?: EmptyStateAction | null

  /**
   * The secondary action of the empty state.
   */
  secondaryAction?: EmptyStateAction | null
}

type ActionButton = {
  type: 'button'
  onClick?: () => Promise<void> | void
} & Omit<ButtonProps, 'size' | 'variant'>

type ActionLink = {
  type: 'link'
  onClick?: () => Promise<void> | void
} & Omit<LinkProps, 'size' | 'variant'>

interface ActionAction {
  action: Action
  type: 'Action'
}

export type EmptyStateAction = ActionAction | ActionButton | ActionLink
