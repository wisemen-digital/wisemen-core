import {
  computed,
  h,
} from 'vue'
import { useI18n } from 'vue-i18n'

import SettingsLanguageSection from '@/modules/settings/default-preferences/language/SettingsLanguageSection.vue'
import type { SettingsSection } from '@/modules/settings/settings.type'

export function useLanguageSetting(): SettingsSection {
  const {
    t,
  } = useI18n()

  return {
    id: 'language',
    title: computed<string>(() => t('module.settings.section.language.title')),
    description: computed<string>(() => t('module.settings.section.language.description')),
    tags: [],
    component: () => h(SettingsLanguageSection),
  }
}
