import type { Component } from 'vue'
import {
  reactive,
  ref,
} from 'vue'

export interface chinConfig {
  icon?: Component
  primaryAction?: () => void
  primaryActionLabel?: string
  secondaryAction?: () => void
  secondaryActionLabel?: string
  text?: string
  variant?: 'default' | 'error'
}

export function useDialogChin() {
  const chin = ref<chinConfig | null>(null)

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
