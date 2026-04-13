import type {
  ComputedRef,
  InjectionKey,
} from 'vue'
import {
  inject,
  provide,
} from 'vue'

import type { BaseCheckboxStyle } from '@/ui/checkbox/base/baseCheckbox.style'

interface CheckboxContext {
  isIndeterminate: ComputedRef<boolean>
  checkboxStyle: ComputedRef<BaseCheckboxStyle>
}

export const checkboxContextKey: InjectionKey<CheckboxContext> = Symbol('CheckboxContextKey')

export function useProvideCheckboxContext(context: CheckboxContext): void {
  provide(checkboxContextKey, context)
}

export function useInjectCheckboxContext(): CheckboxContext {
  const context = inject(checkboxContextKey, null)

  if (context === null) {
    throw new Error('CheckboxContext not provided')
  }

  return context
}
