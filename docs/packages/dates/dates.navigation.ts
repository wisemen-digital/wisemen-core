import type { PackageDocNavigation } from '@docs/packages/navigation.utils'

export const DATES_NAVIGATION: PackageDocNavigation = {
  link: 'pages/getting-started/installation',
  title: 'Dates',
  path: 'dates',
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
          text: 'Models',
          link: '/pages/usage/models',
        },
        {
          text: 'Configuration',
          link: '/pages/usage/configuration',
        },
        {
          text: 'Formatting',
          link: '/pages/usage/formatting',
        },
        {
          text: 'Date Util',
          link: '/pages/usage/date-util',
        },
        {
          text: 'TimeZone Util',
          link: '/pages/usage/timezone-util',
        },
        {
          text: 'Range Util',
          link: '/pages/usage/range-util',
        },
        {
          text: 'Transformers',
          link: '/pages/usage/transformers',
        },
      ],
    },
  ],
}
