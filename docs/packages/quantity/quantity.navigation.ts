import type { PackageDocNavigation } from '@docs/packages/navigation.utils'

export const QUANTITY_NAVIGATION: PackageDocNavigation = {
  link: 'pages/getting-started/installation',
  title: 'Quantity',
  path: 'quantity',
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
          text: 'Overview',
          link: '/pages/usage/overview',
        },
        {
          text: 'Models',
          link: '/pages/usage/models',
        },
      ],
    },
  ],
}
