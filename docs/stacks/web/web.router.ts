import type { PackageDocNavigationGroup } from '#navigation/navigation.utils.ts'

import { ACTIONS_NAVIGATION } from './packages/actions/actions.navigation'
import { API_UTILS_NAVIGATION } from './packages/api-utils/apiUtils.navigation'
import { CONFIGS_NAVIGATION } from './packages/configs/configs.navigation'
import { CUSTOM_VIEWS_NAVIGATION } from './packages/custom-views/customViews.navigation'
import { DATES_NAVIGATION } from './packages/dates/dates.navigation'
import { DESIGN_SYSTEM_NAVIGATION } from './packages/design-system/designSystem.navigation'
import { ESLINT_NAVIGATION } from './packages/eslint/eslint.navigation'
import { FILTERS_NAVIGATION } from './packages/filters/filters.navigation'
import { FORMANGO_NAVIGATION } from './packages/formango/formango.navigation'
import { FORMAT_NAVIGATION } from './packages/format/format.navigation'
import { I18N_FACTORY_NAVIGATION } from './packages/i18n-factory/i18nFactory.navigation'
import { PERMISSIONS_NAVIGATION } from './packages/permissions/permissions.navigation'
import { PREFERENCES_NAVIGATION } from './packages/preferences/preferences.navigation'
import { TELEMETRY_NAVIGATION } from './packages/telemetry/telemetry.navigation'
import { TEST_UTILS_NAVIGATION } from './packages/test-utils/testUtils.navigation'
import { TYPE_UTILS_NAVIGATION } from './packages/type-utils/typeUtils.navigation'
import { UTILS_NAVIGATION } from './packages/utils/utils.navigation'
import { ZOD_VALIDATION_NAVIGATION } from './packages/zod-validation/zodValidation.navigation'

export const PACKAGE_DOC_NAVIGATION: PackageDocNavigationGroup[] = [
  {
    text: 'UI and Design',
    items: [
      DESIGN_SYSTEM_NAVIGATION,
      PREFERENCES_NAVIGATION,
      ACTIONS_NAVIGATION,
      FILTERS_NAVIGATION,
      CUSTOM_VIEWS_NAVIGATION,
    ],
  },
  {
    text: 'Data and API',
    items: [
      API_UTILS_NAVIGATION,
    ],
  },
  {
    text: 'Forms and Validation',
    items: [
      FORMANGO_NAVIGATION,
      ZOD_VALIDATION_NAVIGATION,
    ],
  },
  {
    text: 'Auth and Access',
    items: [
      PERMISSIONS_NAVIGATION,
    ],
  },
  {
    text: 'Observability',
    items: [
      TELEMETRY_NAVIGATION,
      TEST_UTILS_NAVIGATION,
    ],
  },
  {
    text: 'TypeScript Utilities',
    items: [
      TYPE_UTILS_NAVIGATION,
      UTILS_NAVIGATION,
      FORMAT_NAVIGATION,
      DATES_NAVIGATION,
    ],
  },
  {
    text: 'Tooling',
    items: [
      ESLINT_NAVIGATION,
      I18N_FACTORY_NAVIGATION,
      CONFIGS_NAVIGATION,
    ],
  },
]
