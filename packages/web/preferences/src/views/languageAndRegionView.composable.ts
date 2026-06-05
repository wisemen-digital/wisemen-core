import { Globe01Icon } from '@wisemen/vue-core-icons'
import {
  computed,
  markRaw,
} from 'vue'
import { useI18n } from 'vue-i18n'

import type {
  PreferencesSection,
  PreferencesView,
} from '#types/preferences.type'

export function usePreferencesLanguageAndRegionView(sections: PreferencesSection[]): PreferencesView {
  const i18n = useI18n()

  return {
    id: 'language-and-region',
    title: computed(() => i18n.t('module.preferences.views.language_and_region.name')),
    icon: markRaw(Globe01Icon),
    sections,
  }
}
