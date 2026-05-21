import {
  computed,
  h,
} from 'vue'
import { useI18n } from 'vue-i18n'

import type { CreatePreferencesSectionOptions } from '#sections/createPreferencesSection'
import { createPreferencesSection } from '#sections/createPreferencesSection'
import PreferencesHighContrastView from '#sections/high-contrast/PreferencesHighContrastView.vue'

export type HighContrastPreference = boolean

export function useHighContrastPreference(options: CreatePreferencesSectionOptions<HighContrastPreference>) {
  const i18n = useI18n()

  return createPreferencesSection({
    id: 'high-contrast',
    title: computed(() => i18n.t('module.preferences.high_contrast.title')),
    description: computed(() => i18n.t('module.preferences.high_contrast.description')),
    tags: [],
    component: () => h(PreferencesHighContrastView, {
      'modelValue': options.get(),
      'onUpdate:modelValue': options.set,
    }),
  })
}
