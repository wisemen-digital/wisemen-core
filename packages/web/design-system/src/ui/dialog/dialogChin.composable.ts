import type { Component } from 'vue'
import { shallowRef } from 'vue'
import type { RouteLocationRaw } from 'vue-router'

export interface ChinButtonAction {
  isDisabled?: boolean
  isLoading?: boolean
  action: () => Promise<void> | void
  disabledReason?: string | null
  label: string
  type: 'button'
  variant?: 'brand' | 'default' | 'destructive'
}

export interface ChinLinkAction {
  label: string
  link?: {
    href: string
    rel?: string
    target?: '_blank' | '_parent' | '_self' | '_top'
  } | null
  to?: RouteLocationRaw | null
  type: 'link'
  variant?: 'brand' | 'default' | 'destructive'
}

export interface ChinIconButtonAction {
  isDisabled?: boolean
  isLoading?: boolean
  action: () => Promise<void> | void
  disabledReason?: string | null
  icon: Component
  label: string
  type: 'icon-button'
  variant?: 'brand' | 'default' | 'destructive'
}

export type ChinAction = ChinButtonAction | ChinIconButtonAction | ChinLinkAction

export interface ChinConfig {
  icon?: Component
  primaryAction?: ChinAction
  secondaryAction?: ChinAction
  text?: string
  variant?: 'default' | 'error'
}

export function useDialogChin() {
  const chin = shallowRef<ChinConfig | null>(null)

  function open(config: ChinConfig): void {
    chin.value = config
  }

  function close(): void {
    chin.value = null
  }

  return {
    chin,
    close,
    open,
  }
}
