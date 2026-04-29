import { API_UTILS_NAVIGATION } from './api-utils/apiUtils.navigation'
import { COMPONENTS_DOC_NAVIGATION } from './components/components.navigation'
import { CONFIGS_NAVIGATION } from './configs/configs.navigation'
import { DESIGN_SYSTEM_NAVIGATION } from './design-system/designSystem.navigation'
import { ESLINT_NAVIGATION } from './eslint/eslint.navigation'
import { FORMANGO_NAVIGATION } from './formango/formango.navigation'
import { FORMAT_NAVIGATION } from './format/format.navigation'
import { I18N_FACTORY_NAVIGATION } from './i18n-factory/i18nFactory.navigation'
import type { PackageDocNavigation } from './navigation.utils'
import { TELEMETRY_NAVIGATION } from './telemetry/telemetry.navigation'
import { TYPE_UTILS_NAVIGATION } from './type-utils/typeUtils.navigation'
import { UTILS_NAVIGATION } from './utils/utils.navigation'
import { ZOD_VALIDATION_NAVIGATION } from './zod-validation/zodValidation.navigation'

export interface PackageDocNavigationGroup {
  items: PackageDocNavigation[]
  text: string
}

export const PACKAGE_DOC_NAVIGATION: PackageDocNavigationGroup[] = [
  {
    text: 'UI and Design',
    items: [
      DESIGN_SYSTEM_NAVIGATION,
      COMPONENTS_DOC_NAVIGATION,
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
    text: 'Observability',
    items: [
      TELEMETRY_NAVIGATION,
    ],
  },
  {
    text: 'TypeScript Utilities',
    items: [
      TYPE_UTILS_NAVIGATION,
      UTILS_NAVIGATION,
      FORMAT_NAVIGATION,
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
