import type { PackageDocNavigation } from '@docs/navigation/navigation.utils'

export const UTILS_NAVIGATION: PackageDocNavigation = {
  link: '/web/packages/utils/pages/getting-started/installation',
  title: 'Utilities',
  path: 'utils',
  sidebar: [
    {
      text: 'Getting started',
      items: [
        {
          text: 'Installation',
          link: '/web/packages/utils/pages/getting-started/installation',
        },
      ],
    },
    {
      text: 'Usage',
      items: [
        {
          text: 'Array Util',
          link: '/web/packages/utils/pages/usage/array-util',
        },
        {
          text: 'String Util',
          link: '/web/packages/utils/pages/usage/string-util',
        },
        {
          text: 'Number Util',
          link: '/web/packages/utils/pages/usage/number-util',
        },
        {
          text: 'Uuid Util',
          link: '/web/packages/utils/pages/usage/uuid-util',
        },
        {
          text: 'Assertions',
          link: '/web/packages/utils/pages/usage/assertions',
        },
        {
          text: 'Logger',
          link: '/web/packages/utils/pages/usage/logger',
        },
      ],
    },
  ],
}
