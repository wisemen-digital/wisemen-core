import type {
  ComputedRef,
  InjectionKey,
} from 'vue'
import {
  inject,
  provide,
} from 'vue'

import type { BaseRadioGroupStyle } from '@/ui/radio-group/base/baseRadioGroup.style'

interface RadioGroupItemContext {
  radioGroupStyle: ComputedRef<BaseRadioGroupStyle>
}

export const radioGroupItemContextKey: InjectionKey<RadioGroupItemContext> = Symbol('RadioGroupItemContextKey')

export function useProvideRadioGroupItemContext(context: RadioGroupItemContext): void {
  provide(radioGroupItemContextKey, context)
}

export function useInjectRadioGroupItemContext(): RadioGroupItemContext {
  const context = inject(radioGroupItemContextKey, null)

  if (context === null) {
    throw new Error('RadioGroupItemContext not provided')
  }

  return context
}
