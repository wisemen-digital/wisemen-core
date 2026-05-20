import {
  computed,
  h,
} from 'vue'
import { useI18n } from 'vue-i18n'

import { createPreferencesSection } from '#sections/createPreferencesSection'
import PreferencesHourCycleView from '#sections/hour-cycle/PreferencesHourCycleView.vue'

export type HourCycleStoredValue = '12-hour' | '24-hour' | null
export type HourCyclePreferenceValue = '12-hour' | '24-hour' | 'device-default'

export interface HourCyclePreferenceOptions {
  get: () => HourCycleStoredValue
  set: (value: HourCycleStoredValue) => void
}

export function useHourCyclePreference(options: HourCyclePreferenceOptions) {
  const i18n = useI18n()

  return createPreferencesSection({
    id: 'hour-cycle',
    title: computed(() => i18n.t('module.preferences.time_format.title')),
    description: computed(() => i18n.t('module.preferences.time_format.description')),
    tags: [],
    component: () => h(PreferencesHourCycleView, {
      'modelValue': options.get() ?? 'device-default',
      'onUpdate:modelValue': (value: HourCyclePreferenceValue) => {
        options.set(value === 'device-default' ? null : value)
      },
    }),
  })
}
