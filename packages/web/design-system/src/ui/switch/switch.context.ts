import type {
  Component,
  ComputedRef,
  InjectionKey,
} from 'vue'
import {
  inject,
  provide,
} from 'vue'

import type { SwitchStyle } from '@/ui/switch/switch.style'

interface SwitchContext {
  isChecked: ComputedRef<boolean>
  iconChecked: ComputedRef<Component | null>
  iconUnchecked: ComputedRef<Component | null>
  switchStyle: ComputedRef<SwitchStyle>
}

export const switchContextKey: InjectionKey<SwitchContext> = Symbol('SwitchContextKey')

export function useProvideSwitchContext(context: SwitchContext): void {
  provide(switchContextKey, context)
}

export function useInjectSwitchContext(): SwitchContext {
  const context = inject(switchContextKey, null)

  if (context === null) {
    throw new Error('SwitchContext not provided')
  }

  return context
}
