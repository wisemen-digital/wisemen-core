import {
  computed,
  h,
} from 'vue'
import { useI18n } from 'vue-i18n'

import PreferencesAppearanceView from '#sections/appearance/PreferencesAppearanceView.vue'
import type { CreatePreferencesSectionOptions } from '#sections/createPreferencesSection'
import { createPreferencesSection } from '#sections/createPreferencesSection'

export type AppearancePreference = 'dark' | 'light' | 'system'

export interface AppearancePreferenceOptions {
  get: () => AppearancePreference
  set: (value: AppearancePreference) => void
}

export function useAppearancePreference(options: CreatePreferencesSectionOptions<AppearancePreference>) {
  const i18n = useI18n()

  return createPreferencesSection({
    id: 'appearance',
    title: computed(() => i18n.t('module.preferences.appearance.title')),
    description: computed(() => i18n.t('module.preferences.appearance.description')),
    tags: [],
    component: () => h(PreferencesAppearanceView, {
      'modelValue': options.get(),
      'onUpdate:modelValue': options.set,
    }),
  })
}
