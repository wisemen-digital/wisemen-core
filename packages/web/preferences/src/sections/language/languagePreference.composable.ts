import type { ComputedRef } from 'vue'
import {
  computed,
  h,
} from 'vue'
import { useI18n } from 'vue-i18n'

import type { CreatePreferencesSectionOptions } from '#sections/createPreferencesSection'
import { createPreferencesSection } from '#sections/createPreferencesSection'
import PreferencesLanguageView from '#sections/language/PreferencesLanguageView.vue'

export type LanguagePreference = string

export interface LanguagePreferenceOptions extends CreatePreferencesSectionOptions<LanguagePreference> {
  availableLocales: ComputedRef<string[]>
}

export function useLanguagePreference(options: LanguagePreferenceOptions) {
  const i18n = useI18n()

  return createPreferencesSection({
    id: 'language',
    title: computed(() => i18n.t('module.preferences.language.title')),
    description: computed(() => i18n.t('module.preferences.language.description')),
    tags: [],
    component: () => h(PreferencesLanguageView, {
      'availableLocales': options.availableLocales.value,
      'modelValue': options.get(),
      'onUpdate:modelValue': options.set,
    }),
  })
}
