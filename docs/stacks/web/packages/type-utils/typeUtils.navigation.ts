import type { PackageDocNavigation } from '@docs/navigation/navigation.utils'

export const TYPE_UTILS_NAVIGATION: PackageDocNavigation = {
  link: '/web/packages/type-utils/pages/getting-started/installation',
  title: 'Type Utilities',
  path: 'type-utils',
  sidebar: [
    {
      text: 'Getting started',
      items: [
        {
          text: 'Installation',
          link: '/web/packages/type-utils/pages/getting-started/installation',
        },
      ],
    },
    {
      text: 'Usage',
      items: [
        {
          text: 'DeepPartial',
          link: '/web/packages/type-utils/pages/usage/deep-partial',
        },
        {
          text: 'DeepNullable',
          link: '/web/packages/type-utils/pages/usage/deep-nullable',
        },
      ],
    },
  ],
}
