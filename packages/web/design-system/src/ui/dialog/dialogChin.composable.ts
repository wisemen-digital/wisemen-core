import type { Component } from 'vue'
import {
  reactive,
  shallowRef,
} from 'vue'
import type { RouteLocationRaw } from 'vue-router'

export interface ChinButtonAction {
  isDestructive?: boolean
  isDisabled?: boolean
  isLoading?: boolean
  action: () => Promise<void> | void
  disabledReason?: string | null
  label: string
  type: 'button'
}

export interface ChinLinkAction {
  isDestructive?: boolean
  label: string
  link?: {
    href: string
    rel?: string
    target?: '_blank' | '_parent' | '_self' | '_top'
  } | null
  to?: RouteLocationRaw | null
  type: 'link'
}

export interface ChinIconButtonAction {
  isDestructive?: boolean
  isDisabled?: boolean
  isLoading?: boolean
  action: () => Promise<void> | void
  disabledReason?: string | null
  icon: Component
  label: string
  type: 'icon-button'
}

export type ChinAction = ChinButtonAction | ChinIconButtonAction | ChinLinkAction

export interface chinConfig {
  icon?: Component
  primaryAction?: ChinAction
  secondaryAction?: ChinAction
  text?: string
  variant?: 'default' | 'error'
}

export function useDialogChin() {
  const chin = shallowRef<chinConfig | null>(null)

  function open(config: chinConfig): void {
    chin.value = config
  }

  function close(): void {
    chin.value = null
  }

  return reactive({
    chin,
    close,
    open,
  })
}
