import type {
  NumberFormat,
  UIToastAutoClose,
} from '@wisemen/vue-core-design-system'
import {
  computed,
  h,
} from 'vue'
import { useI18n } from 'vue-i18n'

import type { CreatePreferencesSectionOptions } from '#sections/createPreferencesSection'
import { createPreferencesSection } from '#sections/createPreferencesSection'
import PreferencesToastAutoCloseView from '#sections/toast-auto-close/PreferencesToastAutoCloseView.vue'

export type { NumberFormat }

export function useToastAutoClosePreference(options: CreatePreferencesSectionOptions<UIToastAutoClose>) {
  const i18n = useI18n()

  return createPreferencesSection({
    id: 'toast-auto-close',
    title: computed(() => i18n.t('module.preferences.toast_auto_close.title')),
    description: computed(() => i18n.t('module.preferences.toast_auto_close.description')),
    tags: [],
    component: () => h(PreferencesToastAutoCloseView, {
      'modelValue': options.get(),
      'onUpdate:modelValue': options.set,
    }),
  })
}
