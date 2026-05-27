import type { PackageDocNavigation } from '@docs/packages/navigation.utils'

export const FILTERS_NAVIGATION: PackageDocNavigation = {
  link: 'pages/getting-started/installation',
  title: 'Filters',
  path: 'filters',
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
          text: 'Filter types',
          link: '/pages/usage/filter-types',
        },
        {
          text: 'Components',
          link: '/pages/usage/components',
        },
      ],
    },
  ],
}
