import {
  computed,
  h,
} from 'vue'
import { useI18n } from 'vue-i18n'

import type { CreatePreferencesSectionOptions } from '#sections/createPreferencesSection'
import { createPreferencesSection } from '#sections/createPreferencesSection'
import PreferencesTimeZoneView from '#sections/time-zone/PreferencesTimeZoneView.vue'

export type TimeZonePreference = string

export interface TimeZonePreferenceOptions extends CreatePreferencesSectionOptions<TimeZonePreference> {
  availableTimeZones: () => string[]
}

export function useTimeZonePreference(options: TimeZonePreferenceOptions) {
  const i18n = useI18n()

  return createPreferencesSection({
    id: 'time-zone',
    title: computed(() => i18n.t('module.preferences.time_zone.title')),
    description: computed(() => i18n.t('module.preferences.time_zone.description')),
    tags: [],
    component: () => h(PreferencesTimeZoneView, {
      'availableTimeZones': options.availableTimeZones(),
      'modelValue': options.get(),
      'onUpdate:modelValue': options.set,
    }),
  })
}
