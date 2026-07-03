import type { PackageDocNavigation } from '@docs/navigation/navigation.utils'

export const CUSTOM_VIEWS_NAVIGATION: PackageDocNavigation = {
  link: '/web/packages/custom-views/pages/getting-started/installation',
  title: 'Custom Views',
  path: 'custom-views',
  sidebar: [
    {
      text: 'Getting started',
      items: [
        {
          text: 'Installation',
          link: '/web/packages/custom-views/pages/getting-started/installation',
        },
      ],
    },
    {
      text: 'Usage',
      items: [
        {
          text: 'Overview',
          link: '/web/packages/custom-views/pages/usage/overview',
        },
        {
          text: 'Adapters',
          link: '/web/packages/custom-views/pages/usage/adapters',
        },
      ],
    },
  ],
}
