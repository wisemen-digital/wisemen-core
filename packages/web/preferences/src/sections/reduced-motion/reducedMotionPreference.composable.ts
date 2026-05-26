import {
  computed,
  h,
} from 'vue'
import { useI18n } from 'vue-i18n'

import type { CreatePreferencesSectionOptions } from '#sections/createPreferencesSection'
import { createPreferencesSection } from '#sections/createPreferencesSection'
import PreferencesReducedMotionView from '#sections/reduced-motion/PreferencesReducedMotionView.vue'

export type ReducedMotionPreference = boolean

export function useReducedMotionPreference(options: CreatePreferencesSectionOptions<ReducedMotionPreference>) {
  const i18n = useI18n()

  return createPreferencesSection({
    id: 'reduced-motion',
    title: computed(() => i18n.t('module.preferences.reduced_motion.title')),
    description: computed(() => i18n.t('module.preferences.reduced_motion.description')),
    tags: [],
    component: () => h(PreferencesReducedMotionView, {
      'modelValue': options.get(),
      'onUpdate:modelValue': options.set,
    }),
  })
}
