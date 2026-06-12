import {
  computed,
  h,
} from 'vue'
import { useI18n } from 'vue-i18n'

import { createPreferencesSection } from '#sections/createPreferencesSection'
import PreferencesHourCycleView from '#sections/hour-cycle/PreferencesHourCycleView.vue'

export type HourCyclePreference = '12-hour' | '24-hour' | 'locale-default'

export interface HourCyclePreferenceOptions {
  get: () => HourCyclePreference
  set: (value: HourCyclePreference) => void
}

export function useHourCyclePreference(options: HourCyclePreferenceOptions) {
  const i18n = useI18n()

  return createPreferencesSection({
    id: 'hour-cycle',
    title: computed(() => i18n.t('module.preferences.time_format.title')),
    description: computed(() => i18n.t('module.preferences.time_format.description')),
    tags: [],
    component: () => h(PreferencesHourCycleView, {
      'modelValue': options.get() ?? 'locale-default',
      'onUpdate:modelValue': (value: HourCyclePreference) => {
        options.set(value)
      },
    }),
  })
}
