import {
  computed,
  h,
} from 'vue'
import { useI18n } from 'vue-i18n'

import SettingsAppearanceSection from '@/modules/settings/default-preferences/appearance/SettingsAppearanceSection.vue'
import type { SettingsSection } from '@/modules/settings/settings.type'

export function useAppearanceSetting(): SettingsSection {
  const {
    t,
  } = useI18n()

  return {
    id: 'appearance',
    title: computed<string>(() => t('module.settings.section.appearance.title')),
    description: computed<string>(() => t('module.settings.section.appearance.description')),
    tags: [
      t('module.settings.section.appearance.option.light_mode'),
      t('module.settings.section.appearance.option.dark_mode'),
      t('module.settings.section.appearance.option.system_preference'),
    ],
    component: () => h(SettingsAppearanceSection),
  }
}
