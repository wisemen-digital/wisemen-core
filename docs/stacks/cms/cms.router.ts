import type { PackageDocNavigationGroup } from '#navigation/navigation.utils.ts'

import { PAYLOAD_TRANSLATE_NAVIGATION } from './packages/translate/translate.navigation'

export const CMS_PACKAGES_NAVIGATION: PackageDocNavigationGroup[] = [
  {
    text: 'Packages',
    items: [
      PAYLOAD_TRANSLATE_NAVIGATION,
    ],
  },
]
