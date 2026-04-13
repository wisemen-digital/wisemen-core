import {
  computed,
  h,
} from 'vue'
import { useI18n } from 'vue-i18n'

import SettingsKeyboardShortcutHintsSection from '@/modules/settings/default-preferences/keyboard-shortcut-hints/SettingsKeyboardShortcutHintsSection.vue'
import type { SettingsSection } from '@/modules/settings/settings.type'

export function useKeyboardShortcutHintsSetting(): SettingsSection {
  const {
    t,
  } = useI18n()

  return {
    id: 'keyboard-shortcut-hints',
    title: computed<string>(() => t('module.settings.section.keyboard_shortcut_hints.title')),
    description: computed<string>(() => t('module.settings.section.keyboard_shortcut_hints.description')),
    tags: [],
    component: () => h(SettingsKeyboardShortcutHintsSection),
  }
}
