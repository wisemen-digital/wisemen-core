import type { PackageDocNavigation } from '@docs/navigation/navigation.utils'

export const DATES_NAVIGATION: PackageDocNavigation = {
  link: '/web/packages/dates/pages/getting-started/installation',
  title: 'Dates',
  path: 'dates',
  sidebar: [
    {
      text: 'Getting started',
      items: [
        {
          text: 'Installation',
          link: '/web/packages/dates/pages/getting-started/installation',
        },
      ],
    },
    {
      text: 'Usage',
      items: [
        {
          text: 'Models',
          link: '/web/packages/dates/pages/usage/models',
        },
        {
          text: 'Configuration',
          link: '/web/packages/dates/pages/usage/configuration',
        },
        {
          text: 'Formatting',
          link: '/web/packages/dates/pages/usage/formatting',
        },
        {
          text: 'Date Util',
          link: '/web/packages/dates/pages/usage/date-util',
        },
        {
          text: 'TimeZone Util',
          link: '/web/packages/dates/pages/usage/timezone-util',
        },
        {
          text: 'Range Util',
          link: '/web/packages/dates/pages/usage/range-util',
        },
        {
          text: 'Transformers',
          link: '/web/packages/dates/pages/usage/transformers',
        },
      ],
    },
  ],
}
