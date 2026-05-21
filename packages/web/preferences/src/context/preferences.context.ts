import type {
  ComputedRef,
  Ref,
} from 'vue'

import { useContext } from '#composables/context.composable'
import type { PreferencesHistory } from '#composables/preferencesHistory.composable'
import type {
  PreferencesCategory,
  PreferencesConfig,
  PreferencesView,
} from '#types/preferences.type'

interface PreferencesContext extends PreferencesHistory {
  isSidebarVisible: Ref<boolean>
  activeView: ComputedRef<PreferencesView>
  config: ComputedRef<PreferencesConfig>
  filteredCategories: ComputedRef<PreferencesCategory[]>
  searchTerm: Ref<string>
}

export const [
  useProvidePreferencesContext,
  useInjectPreferencesContext,
] = useContext<PreferencesContext>('preferencesContext')
