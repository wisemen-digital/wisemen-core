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
        'component.button.loading_label': 'Loading...',
        'component.keyboard_shortcut.then': 'then',
        'component.password_field.hide_password': 'Hide password',
        'component.password_field.show_password': 'Show password',
        'component.select.empty_text': 'No results found for "{searchTerm}"',
        'component.select.remove_value': 'Remove value',
        'component.select.search_input_placeholder': 'Search',
        'component.table.clear_filter': 'Clear filter|Clear filters',
        'component.table.no_data.description': 'There is currently no data available.',
        'component.table.no_data.title': 'No data available',
        'component.table.no_results.description': 'We couldn\'t find any results for your search. Please try again with different criteria.',
        'component.table.no_results.title': 'We couldn\'t find any results',
        'component.table.results_may_be_hidden': 'Some results may be hidden because of {count} active filter|Some results may be hidden because of {count} active filters',
        'shared.close': 'Close',
        'shared.loading': 'Loading...',
      },
    },
  })

  app.use(i18n)

  addWrapper(StoryWrapper)
})
