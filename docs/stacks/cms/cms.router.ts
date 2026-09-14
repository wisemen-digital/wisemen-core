import type { PackageDocNavigationGroup } from '#navigation/navigation.utils.ts'

import { PAYLOAD_AUTH_NAVIGATION } from './packages/auth/auth.navigation'
import { PAYLOAD_LINKS_NAVIGATION } from './packages/links/links.navigation'
import { PAYLOAD_OBSERVABILITY_NAVIGATION } from './packages/observability/observability.navigation'
import { PAYLOAD_SEEDER_NAVIGATION } from './packages/seeder/seeder.navigation'
import { PAYLOAD_SETTINGS_NAVIGATION } from './packages/settings/settings.navigation'
import { PAYLOAD_TRANSLATE_NAVIGATION } from './packages/translate/translate.navigation'
import { PAYLOAD_UTILS_NAVIGATION } from './packages/utils/utils.navigation'

export const CMS_PACKAGES_NAVIGATION: PackageDocNavigationGroup[] = [
  {
    text: 'Packages',
    items: [
      PAYLOAD_AUTH_NAVIGATION,
      PAYLOAD_LINKS_NAVIGATION,
      PAYLOAD_OBSERVABILITY_NAVIGATION,
      PAYLOAD_SEEDER_NAVIGATION,
      PAYLOAD_SETTINGS_NAVIGATION,
      PAYLOAD_TRANSLATE_NAVIGATION,
      PAYLOAD_UTILS_NAVIGATION,
    ],
  },
]
