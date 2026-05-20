import { Grid01Icon } from '@wisemen/vue-core-icons'
import {
  computed,
  markRaw,
} from 'vue'
import { useI18n } from 'vue-i18n'

import type {
  PreferencesSection,
  PreferencesView,
} from '#types/preferences.type'

export function usePreferencesGeneralView(sections: PreferencesSection[]): PreferencesView {
  const i18n = useI18n()

  return {
    id: 'general',
    title: computed(() => i18n.t('module.preferences.views.general.name')),
    icon: markRaw(Grid01Icon),
    sections,
  }
}
