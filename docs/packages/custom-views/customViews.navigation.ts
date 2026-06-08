import type { PackageDocNavigation } from '@docs/packages/navigation.utils'

export const CUSTOM_VIEWS_NAVIGATION: PackageDocNavigation = {
  link: 'pages/getting-started/installation',
  title: 'Custom Views',
  path: 'custom-views',
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
          text: 'Adapters',
          link: '/pages/usage/adapters',
        },
      ],
    },
  ],
}
