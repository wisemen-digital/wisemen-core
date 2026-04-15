import type { PackageDocNavigation } from '@docs/packages/navigation.utils'

export const API_UTILS_NAVIGATION: PackageDocNavigation = {
  link: 'pages/getting-started/installation',
  title: 'API Utilities',
  path: 'api-utils',
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
      text: 'Concepts',
      items: [
        {
          text: 'Result types',
          link: '/pages/concepts/result-types',
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
          text: 'Service',
          link: '/pages/usage/Service',
        },

        {
          text: 'Query',
          link: '/pages/usage/query',
        },
        {
          text: 'Mutation',
          link: '/pages/usage/mutation',
        },
        {
          text: 'Paginated Query',
          link: '/pages/usage/paginated-query',
        },
      ],
    },
  ],
}
