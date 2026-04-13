import './src/styles/index.css'

import { defineSetupVue3 } from '@histoire/plugin-vue'
import { createI18n } from 'vue-i18n'

import StoryWrapper from './src/StoryWrapper.vue'

export const setupVue3 = defineSetupVue3(({
  addWrapper, app,
}) => {
  const i18n = createI18n({
    legacy: false,
    locale: 'en-NL',
    messages: {
      'en-NL': {
        'module.settings.back.label': 'Back',
        'module.settings.description': 'Manage your app settings.',
        'module.settings.disabled': 'Disabled',
        'module.settings.enabled': 'Enabled',
        'module.settings.expand.label': 'Expand settings view',
        'module.settings.forward.label': 'Forward',
        'module.settings.maximize.label': 'Maximize',
        'module.settings.minimize.label': 'Minimize',
        'module.settings.no_results': 'No results found for "{searchTerm}".',
        'module.settings.search.clear.label': 'Clear search term',
        'module.settings.search.placeholder': 'Quick search',
        'module.settings.section.appearance.description': 'Customize the overall look and feel of the app.',
        'module.settings.section.appearance.option.dark_mode': 'Dark mode',
        'module.settings.section.appearance.option.light_mode': 'Light mode',
        'module.settings.section.appearance.option.system_preference': 'System preference',
        'module.settings.section.appearance.title': 'Appearance',
        'module.settings.section.font_size.description': 'Adjust the text size for better readability or to fit more content on your screen.',
        'module.settings.section.font_size.option.default': 'Default',
        'module.settings.section.font_size.option.large': 'Large',
        'module.settings.section.font_size.option.larger': 'Larger',
        'module.settings.section.font_size.option.small': 'Small',
        'module.settings.section.font_size.option.smaller': 'Smaller',
        'module.settings.section.font_size.title': 'Font size',
        'module.settings.section.high_contrast.description': 'Enhance visibility and reduce eye strain with high contrast mode.',
        'module.settings.section.high_contrast.disabled.label': 'High contrast mode is disabled.',
        'module.settings.section.high_contrast.enabled.label': 'High contrast mode is enabled.',
        'module.settings.section.high_contrast.title': 'High contrast',
        'module.settings.section.keyboard_shortcut_hints.description': 'Toggle hints for keyboard shortcuts to help you navigate the app more efficiently.',
        'module.settings.section.keyboard_shortcut_hints.disabled.label': 'Keyboard shortcut hints are hidden.',
        'module.settings.section.keyboard_shortcut_hints.enabled.label': 'Keyboard shortcut hints are visible.',
        'module.settings.section.keyboard_shortcut_hints.example': 'Example',
        'module.settings.section.keyboard_shortcut_hints.not_available_on_mobile': 'Keyboard shortcuts aren\'t available on mobile or tablet devices. To change this setting, open the app on a desktop.',
        'module.settings.section.keyboard_shortcut_hints.title': 'Keyboard shortcut hints',
        'module.settings.section.language.description': 'Select your preferred language for the app.',
        'module.settings.section.language.title': 'Language',
        'module.settings.settings_are_hidden.label': '{count} setting in "{viewName}" is currently hidden. | {count} settings in "{viewName}" are currently hidden.',
        'module.settings.settings_are_hidden.show_all.label': 'Show all settings',
        'module.settings.title': 'Settings',
      },
    },
  })

  app.use(i18n)

  addWrapper(StoryWrapper)
})
