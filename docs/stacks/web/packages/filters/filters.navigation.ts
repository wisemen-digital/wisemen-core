import type { PackageDocNavigation } from '@docs/navigation/navigation.utils'

export const FILTERS_NAVIGATION: PackageDocNavigation = {
  link: '/web/packages/filters/pages/getting-started/installation',
  title: 'Filters',
  path: 'filters',
  sidebar: [
    {
      text: 'Getting started',
      items: [
        {
          text: 'Installation',
          link: '/web/packages/filters/pages/getting-started/installation',
        },
      ],
    },
    {
      text: 'Usage',
      items: [
        {
          text: 'Overview',
          link: '/web/packages/filters/pages/usage/overview',
        },
        {
          text: 'Filter types',
          link: '/web/packages/filters/pages/usage/filter-types',
        },
        {
          text: 'Components',
          link: '/web/packages/filters/pages/usage/components',
        },
      ],
    },
  ],
}
