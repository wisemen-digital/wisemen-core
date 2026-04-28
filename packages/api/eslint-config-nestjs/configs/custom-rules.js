/* eslint-disable import-typescript/no-relative-parent-imports */
import plugin from '../custom-rules/plugin.js'

export default [
  {
    plugins: {
      'custom-rules': plugin
    },
    rules: {
      'custom-rules/check-missing-translations': 'error',
      'custom-rules/check-api-property-types': 'error',
      'custom-rules/check-column-types': 'error'
    }
  }
]
