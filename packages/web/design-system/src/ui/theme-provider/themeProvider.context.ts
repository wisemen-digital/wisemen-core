import { usePreferredColorScheme } from '@vueuse/core'
import type { ComputedRef } from 'vue'
import { computed } from 'vue'

import { useContext } from '@/composables/context.composable'
import type { Appearance } from '@/types/appearance.type'

interface ThemeProviderContext {
  appearance: ComputedRef<Appearance>
  resolvedAppearance: ComputedRef<Exclude<Appearance, 'system'>>
  theme: ComputedRef<string & {} | 'default'>
}

const [
  useProvideThemeProviderContext,
  useInjectThemeProviderContextBase,
] = useContext<ThemeProviderContext>('themeProviderContext')

export { useProvideThemeProviderContext }

export function useInjectThemeProviderContext(): ThemeProviderContext {
  const preferredColorScheme = usePreferredColorScheme()

  return useInjectThemeProviderContextBase(null) ?? {
    appearance: computed<Appearance>(() => 'light'),
    resolvedAppearance: computed<Exclude<Appearance, 'system'>>(() => (
      preferredColorScheme.value === 'dark' ? 'dark' : 'light'
    )),
    theme: computed<string>(() => 'default'),
  }
}
