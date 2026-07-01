import type { PackageDocNavigationGroup } from '#navigation/navigation.utils.ts'
import { EXAMPLE_NAVIGATION } from '#stacks/api/packages/example/example.navigation.ts'

export const API_PACKAGES_NAVIGATION: PackageDocNavigationGroup[] = [
  {
    text: 'Example',
    items: [
      EXAMPLE_NAVIGATION,
    ],
  },

]
