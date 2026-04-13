import type {
  ComputedRef,
  InjectionKey,
} from 'vue'
import {
  computed,
  inject,
  provide,
} from 'vue'

import type { Appearance } from '@/types/appearance.type'

interface ThemeProviderContext {
  appearance: ComputedRef<Appearance>
  theme: ComputedRef<string & {} | 'default'>
}

export const themeProviderContextKey: InjectionKey<ThemeProviderContext> = Symbol('themeProviderContextKey')

export function useProvideThemeProviderContext(context: ThemeProviderContext): void {
  provide(themeProviderContextKey, context)
}

export function useInjectThemeProviderContext(): ThemeProviderContext {
  const context = inject(themeProviderContextKey, null)

  if (context === null) {
    return {
      appearance: computed<Appearance>(() => 'light'),
      theme: computed<string>(() => 'default'),
    }
  }

  return context
}
