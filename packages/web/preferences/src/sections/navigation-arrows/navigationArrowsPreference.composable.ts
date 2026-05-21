import {
  computed,
  h,
} from 'vue'
import { useI18n } from 'vue-i18n'

import type { CreatePreferencesSectionOptions } from '#sections/createPreferencesSection'
import { createPreferencesSection } from '#sections/createPreferencesSection'
import PreferencesNavigationArrowsView from '#sections/navigation-arrows/PreferencesNavigationArrowsView.vue'

export type NavigationArrowsPreference = 'hide' | 'show'

export function useNavigationArrowsPreference(options: CreatePreferencesSectionOptions<NavigationArrowsPreference>) {
  const i18n = useI18n()

  return createPreferencesSection({
    id: 'navigation-arrows',
    title: computed(() => i18n.t('module.preferences.navigation_arrows.title')),
    description: computed(() => i18n.t('module.preferences.navigation_arrows.description')),
    tags: [],
    component: () => h(PreferencesNavigationArrowsView, {
      'modelValue': options.get(),
      'onUpdate:modelValue': options.set,
    }),
  })
}
