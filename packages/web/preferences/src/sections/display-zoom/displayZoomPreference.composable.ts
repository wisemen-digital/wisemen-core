import {
  computed,
  h,
} from 'vue'
import { useI18n } from 'vue-i18n'

import type { CreatePreferencesSectionOptions } from '#sections/createPreferencesSection'
import { createPreferencesSection } from '#sections/createPreferencesSection'
import PreferencesDisplayZoomView from '#sections/display-zoom/PreferencesDisplayZoomView.vue'

export type DisplayZoomPreference = 'default' | 'large' | 'small'

export function useDisplayZoomPreference(options: CreatePreferencesSectionOptions<DisplayZoomPreference>) {
  const i18n = useI18n()

  return createPreferencesSection({
    id: 'display-zoom',
    title: computed(() => i18n.t('module.preferences.display_zoom.title')),
    description: computed(() => i18n.t('module.preferences.display_zoom.description')),
    tags: [],
    component: () => h(PreferencesDisplayZoomView, {
      'modelValue': options.get(),
      'onUpdate:modelValue': options.set,
    }),
  })
}
