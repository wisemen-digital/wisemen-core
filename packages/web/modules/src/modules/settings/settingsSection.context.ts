import type { ComputedRef } from 'vue'

import { useContext } from '@/composables/context.composable'
import type { SettingsSection } from '@/modules/settings/settings.type'

interface SettingsSectionContext {
  section: ComputedRef<SettingsSection>
}

export const [
  useProvideSettingsSectionContext,
  useInjectSettingsSectionContext,
] = useContext<SettingsSectionContext>('settingsSectionContext')
