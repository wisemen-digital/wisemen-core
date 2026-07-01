import type { PackageDocNavigation } from '@docs/navigation/navigation.utils'

export const FORMAT_NAVIGATION: PackageDocNavigation = {
  link: '/web/packages/format/pages/getting-started/installation',
  title: 'Format',
  path: 'format',
  sidebar: [
    {
      text: 'Getting started',
      items: [
        {
          text: 'Installation',
          link: '/web/packages/format/pages/getting-started/installation',
        },
      ],
    },
    {
      text: 'Usage',
      items: [
        {
          text: 'Configuration',
          link: '/web/packages/format/pages/usage/configuration',
        },
        {
          text: 'Number formatting',
          link: '/web/packages/format/pages/usage/number-formatting',
        },
        {
          text: 'String formatting',
          link: '/web/packages/format/pages/usage/string-formatting',
        },
        {
          text: 'Name formatting',
          link: '/web/packages/format/pages/usage/name-formatting',
        },
      ],
    },
  ],
}
