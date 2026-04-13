import type {
  ComputedRef,
  Ref,
} from 'vue'

import { useContext } from '@/composables/context.composable'
import type { DefaultPreferences } from '@/modules/settings/default-preferences/defaultPreferences'
import type {
  SettingsCategory,
  SettingsConfig,
  SettingsView,
} from '@/modules/settings/settings.type'
import type { SettingsHistory } from '@/modules/settings/settingsHistory.composable'

interface SettingsContext extends SettingsHistory {
  isSidebarVisible: Ref<boolean>
  activeView: ComputedRef<SettingsView>
  config: ComputedRef<SettingsConfig>
  defaultPreferencesState: Ref<DefaultPreferences>
  filteredCategories: ComputedRef<SettingsCategory[]>
  searchTerm: Ref<string>
}

export const [
  useProvideSettingsContext,
  useInjectSettingsContext,
] = useContext<SettingsContext>('settingsContext')
