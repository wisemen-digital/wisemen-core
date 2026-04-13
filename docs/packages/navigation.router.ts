import { API_UTILS_NAVIGATION } from './api-utils/apiUtils.navigation'
import { COMPONENTS_DOC_NAVIGATION } from './components/components.navigation'
import { CONFIGS_NAVIGATION } from './configs/configs.navigation'
import { DESIGN_SYSTEM_NAVIGATION } from './design-system/designSystem.navigation'
import { ESLINT_NAVIGATION } from './eslint/eslint.navigation'
import { FORMANGO_NAVIGATION } from './formango/formango.navigation'
import { I18N_FACTORY_NAVIGATION } from './i18n-factory/i18nFactory.navigation'
import type { PackageDocNavigation } from './navigation.utils'
import { TELEMETRY_NAVIGATION } from './telemetry/telemetry.navigation'
import { TYPE_UTILS_NAVIGATION } from './type-utils/typeUtils.navigation'

export const PACKAGE_DOC_NAVIGATION: PackageDocNavigation[] = [
  DESIGN_SYSTEM_NAVIGATION,
  COMPONENTS_DOC_NAVIGATION,
  CONFIGS_NAVIGATION,
  API_UTILS_NAVIGATION,
  ESLINT_NAVIGATION,
  FORMANGO_NAVIGATION,
  I18N_FACTORY_NAVIGATION,
  TELEMETRY_NAVIGATION,
  TYPE_UTILS_NAVIGATION,
]
