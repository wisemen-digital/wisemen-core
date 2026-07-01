import {
  computed,
  h,
} from 'vue'
import { useI18n } from 'vue-i18n'

import { createPreferencesSection } from '#sections/createPreferencesSection'
import PreferencesDateFormatView from '#sections/date-format/PreferencesDateFormatView.vue'

export type DateFormatPreference
  = | 'de-DE'
    | 'en-GB'
    | 'en-US'
    | 'ja-JP'
    | 'locale-default'
    | 'nl-NL'
    | 'sv-SE'

export interface DateFormatPreferenceOptions {
  get: () => DateFormatPreference
  set: (value: DateFormatPreference) => void
}

export function useDateFormatPreference(options: DateFormatPreferenceOptions) {
  const i18n = useI18n()

  return createPreferencesSection({
    id: 'date-format',
    title: computed(() => i18n.t('module.preferences.date_format.title')),
    description: computed(() => i18n.t('module.preferences.date_format.description')),
    tags: [],
    component: () => h(PreferencesDateFormatView, {
      'modelValue': options.get() ?? 'locale-default',
      'onUpdate:modelValue': (value: DateFormatPreference) => {
        options.set(value)
      },
    }),
  })
}
