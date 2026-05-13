import type {
  Component,
  ComputedRef,
} from 'vue'

import { useContext } from '@/composables/context.composable'
import type { SwitchStyle } from '@/ui/switch/switch.style'

interface SwitchContext {
  isChecked: ComputedRef<boolean>
  iconChecked: ComputedRef<Component | null>
  iconUnchecked: ComputedRef<Component | null>
  switchStyle: ComputedRef<SwitchStyle>
}

export const [
  useProvideSwitchContext,
  useInjectSwitchContext,
] = useContext<SwitchContext>('switchContext')
