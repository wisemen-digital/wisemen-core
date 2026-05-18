import type { ComputedRef } from 'vue'
import { computed } from 'vue'

import { useContext } from '@/composables/context.composable'
import type { Appearance } from '@/types/appearance.type'

interface ThemeProviderContext {
  appearance: ComputedRef<Appearance>
  theme: ComputedRef<string & {} | 'default'>
}

const [
  useProvideThemeProviderContext,
  useInjectThemeProviderContextBase,
] = useContext<ThemeProviderContext>('themeProviderContext')

export { useProvideThemeProviderContext }

export function useInjectThemeProviderContext(): ThemeProviderContext {
  return useInjectThemeProviderContextBase(null) ?? {
    appearance: computed<Appearance>(() => 'light'),
    theme: computed<string>(() => 'default'),
  }
}
