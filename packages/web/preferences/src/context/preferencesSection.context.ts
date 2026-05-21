import type { ComputedRef } from 'vue'

import { useContext } from '#composables/context.composable'
import type { PreferencesSection } from '#types/preferences.type'

interface PreferencesSectionContext {
  section: ComputedRef<PreferencesSection>
}

export const [
  useProvidePreferencesSectionContext,
  useInjectPreferencesSectionContext,
] = useContext<PreferencesSectionContext>('preferencesSectionContext')
