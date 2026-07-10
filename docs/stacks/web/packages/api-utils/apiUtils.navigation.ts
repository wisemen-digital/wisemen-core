import type { PackageDocNavigation } from '@docs/navigation/navigation.utils'

export const API_UTILS_NAVIGATION: PackageDocNavigation = {
  link: '/web/packages/api-utils/pages/getting-started/installation',
  title: 'API Utilities',
  path: 'api-utils',
  sidebar: [
    {
      text: 'Getting started',
      items: [
        {
          text: 'Installation',
          link: '/web/packages/api-utils/pages/getting-started/installation',
        },
      ],
    },
    {
      text: 'Concepts',
      items: [
        {
          text: 'Result types',
          link: '/web/packages/api-utils/pages/concepts/result-types',
        },
      ],
    },
    {
      text: 'Usage',
      items: [
        {
          text: 'Overview',
          link: '/web/packages/api-utils/pages/usage/overview',
        },
        {
          text: 'Service',
          link: '/web/packages/api-utils/pages/usage/Service',
        },

        {
          text: 'Query',
          link: '/web/packages/api-utils/pages/usage/query',
        },
        {
          text: 'Mutation',
          link: '/web/packages/api-utils/pages/usage/mutation',
        },
        {
          text: 'Paginated Query',
          link: '/web/packages/api-utils/pages/usage/paginated-query',
        },
      ],
    },
  ],
}
