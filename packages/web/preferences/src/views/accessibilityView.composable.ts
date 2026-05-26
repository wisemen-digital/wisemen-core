import {
  computed,
  markRaw,
} from 'vue'
import { useI18n } from 'vue-i18n'

import AccessibilityIcon from '@/icons/AccessibilityIcon.vue'
import type {
  PreferencesSection,
  PreferencesView,
} from '#types/preferences.type'

export function usePreferencesAccessibilityView(sections: PreferencesSection[]): PreferencesView {
  const i18n = useI18n()

  return {
    id: 'accessibility',
    title: computed(() => i18n.t('module.preferences.views.accessibility.name')),
    icon: markRaw(AccessibilityIcon),
    sections,
  }
}
