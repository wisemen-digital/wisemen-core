import type { ComputedRef } from 'vue'

import { useContext } from '@/composables/context.composable'
import type { HourCycle } from '@/types/hourCycle.type'

interface ConfigContext {
  areKeyboardShortcutHintsHidden: ComputedRef<boolean>
  googleMapsApiKey: string | null
  hourCycle: ComputedRef<HourCycle | null>
  locale: ComputedRef<string>
  pagination?: {
    limit?: number
  }
  teleportTargetSelector: string

  // TODO: add toast config
  // toastPosition?: ToastPosition
  // autoCloseToast: ComputedRef<AutoCloseToastConfig | null>
}

export const [
  useProvideConfigContext,
  useInjectConfigContext,
] = useContext<ConfigContext>('configContext')
