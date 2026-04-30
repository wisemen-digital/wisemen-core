// oxlint-disable custom-rules/no-relative-import
import { eslintCompatPlugin } from '@oxlint/plugins'

import checkApiPropertyTypes from './check-api-property-types.js'
import checkColumnTypes from './check-column-types.js'
import checkMissingTranslations from './check-missing-translations.js'
import { rules as noRelativeRules } from './no-relative-parent-imports.js'

export default eslintCompatPlugin({
  meta: {
    name: 'custom-rules',
  },
  rules: {
    'check-api-property-types': checkApiPropertyTypes,
    'check-column-types': checkColumnTypes,
    'check-missing-translations': checkMissingTranslations,
    ...noRelativeRules,
  },
})
