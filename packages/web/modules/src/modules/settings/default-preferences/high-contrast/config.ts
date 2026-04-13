import {
  computed,
  h,
} from 'vue'
import { useI18n } from 'vue-i18n'

import SettingsHighContrastSection from '@/modules/settings/default-preferences/high-contrast/SettingsHighContrastSection.vue'
import type { SettingsSection } from '@/modules/settings/settings.type'

export function useHighContrastSetting(): SettingsSection {
  const {
    t,
  } = useI18n()

  return {
    id: 'high-contrast',
    title: computed<string>(() => t('module.settings.section.high_contrast.title')),
    description: computed<string>(() => t('module.settings.section.high_contrast.description')),
    tags: [],
    component: () => h(SettingsHighContrastSection),
  }
}
