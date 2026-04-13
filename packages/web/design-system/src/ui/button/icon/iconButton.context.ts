import type {
  ComputedRef,
  InjectionKey,
} from 'vue'
import {
  inject,
  provide,
} from 'vue'

import type { IconButtonStyle } from '@/ui/button/icon/iconButton.style'

interface IconButtonContext {
  iconButtonStyle: ComputedRef<IconButtonStyle>
}

export const iconButtonContextKey: InjectionKey<IconButtonContext> = Symbol('IconButtonContextKey')

export function useProvideIconButtonContext(context: IconButtonContext): void {
  provide(iconButtonContextKey, context)
}

export function useInjectIconButtonContext(): IconButtonContext {
  const context = inject(iconButtonContextKey, null)

  if (context === null) {
    throw new Error('IconButtonContext not provided')
  }

  return context
}
