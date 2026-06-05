import type { NumberFormat } from '@wisemen/vue-core-design-system'
import {
  computed,
  h,
} from 'vue'
import { useI18n } from 'vue-i18n'

import type { CreatePreferencesSectionOptions } from '#sections/createPreferencesSection'
import { createPreferencesSection } from '#sections/createPreferencesSection'
import PreferencesNumberFormatView from '#sections/number-format/PreferencesNumberFormatView.vue'

export type { NumberFormat }

export function useNumberFormatPreference(options: CreatePreferencesSectionOptions<NumberFormat>) {
  const i18n = useI18n()

  return createPreferencesSection({
    id: 'number-format',
    title: computed(() => i18n.t('module.preferences.number_format.title')),
    description: computed(() => i18n.t('module.preferences.number_format.description')),
    tags: [],
    component: () => h(PreferencesNumberFormatView, {
      'modelValue': options.get(),
      'onUpdate:modelValue': options.set,
    }),
  })
}
