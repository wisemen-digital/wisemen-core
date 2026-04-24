import type { ComputedRef } from 'vue'

import { useContext } from '@/composables/context.composable'
import type { HourCycle } from '@/types/hourCycle.type'
import type { NumberSeparatorStyle } from '@/types/numberSeparatorStyle.type'

interface ConfigContext {
  areKeyboardShortcutHintsHidden: ComputedRef<boolean>
  googleMapsApiKey: string | null
  hourCycle: ComputedRef<HourCycle | null>
  locale: ComputedRef<string>
  numberSeparatorStyle: ComputedRef<NumberSeparatorStyle>
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
