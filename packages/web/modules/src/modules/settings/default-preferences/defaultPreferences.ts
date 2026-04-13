import type { ComputedRef } from 'vue'
import { computed } from 'vue'

import { useInjectSettingsContext } from '@/modules/settings/settings.context'

export interface DefaultPreferences {
  appearance: 'dark' | 'light' | 'system'
  enableHighContrast: boolean
  enableKeyboardShortcutHints: boolean
  fontSize: 'default' | 'large' | 'larger' | 'small' | 'smaller'
  language: string
}

export function useDefaultPreference<
  TKey extends keyof DefaultPreferences,
>(key: TKey): ComputedRef<DefaultPreferences[TKey]> {
  const {
    defaultPreferencesState,
  } = useInjectSettingsContext()

  const value = computed<DefaultPreferences[TKey]>({
    get: () => defaultPreferencesState.value[key],
    set: (newValue) => {
      defaultPreferencesState.value[key] = newValue
    },
  })

  return value
}
