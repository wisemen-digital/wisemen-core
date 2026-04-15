import type { PackageDocNavigation } from '@docs/packages/navigation.utils'

export const UTILS_NAVIGATION: PackageDocNavigation = {
  link: '/pages/getting-started/installation',
  title: 'Utilities',
  path: 'utils',
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
          text: 'Array Util',
          link: '/pages/usage/array-util',
        },
        {
          text: 'String Util',
          link: '/pages/usage/string-util',
        },
        {
          text: 'Number Util',
          link: '/pages/usage/number-util',
        },
        {
          text: 'Uuid Util',
          link: '/pages/usage/uuid-util',
        },
        {
          text: 'Assertions',
          link: '/pages/usage/assertions',
        },
        {
          text: 'Logger',
          link: '/pages/usage/logger',
        },
      ],
    },
  ],
}
