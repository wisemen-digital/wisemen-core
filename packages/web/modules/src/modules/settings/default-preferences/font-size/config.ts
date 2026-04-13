import {
  computed,
  h,
} from 'vue'
import { useI18n } from 'vue-i18n'

import SettingsFontSizeSection from '@/modules/settings/default-preferences/font-size/SettingsFontSizeSection.vue'
import type { SettingsSection } from '@/modules/settings/settings.type'

export function useFontSizeSetting(): SettingsSection {
  const {
    t,
  } = useI18n()

  return {
    id: 'font-size',
    title: computed<string>(() => t('module.settings.section.font_size.title')),
    description: computed<string>(() => t('module.settings.section.font_size.description')),
    tags: [],
    component: () => h(SettingsFontSizeSection),
  }
}
