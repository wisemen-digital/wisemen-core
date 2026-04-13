import type {
  ComputedRef,
  InjectionKey,
} from 'vue'
import {
  inject,
  provide,
} from 'vue'

import type { ButtonStyle } from '@/ui/button/button/button.style'

interface ButtonContext {
  buttonStyle: ComputedRef<ButtonStyle>
}

export const buttonContextKey: InjectionKey<ButtonContext> = Symbol('ButtonContextKey')

export function useProvideButtonContext(context: ButtonContext): void {
  provide(buttonContextKey, context)
}

export function useInjectButtonContext(): ButtonContext {
  const context = inject(buttonContextKey, null)

  if (context === null) {
    throw new Error('ButtonContext not provided')
  }

  return context
}
