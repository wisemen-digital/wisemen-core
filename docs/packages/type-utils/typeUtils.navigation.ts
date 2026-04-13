import type { PackageDocNavigation } from '@docs/packages/navigation.utils'

export const TYPE_UTILS_NAVIGATION: PackageDocNavigation = {
  link: 'index',
  title: 'Type Utils',
  path: 'type-utils',
  sidebar: [
    {
      text: 'Getting started',
      items: [
        {
          text: 'Installation',
          link: '/pages/getting-started/installation',
        },
      ],
    },
    {
      text: 'Usage',
      items: [
        {
          text: 'DeepPartial',
          link: '/pages/usage/deep-partial',
        },
        {
          text: 'DeepNullable',
          link: '/pages/usage/deep-nullable',
        },
      ],
    },
  ],
}
