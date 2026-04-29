import type { PackageDocNavigation } from '@docs/packages/navigation.utils'

export const FORMAT_NAVIGATION: PackageDocNavigation = {
  link: 'pages/getting-started/installation',
  title: 'Format',
  path: 'format',
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
          text: 'Configuration',
          link: '/pages/usage/configuration',
        },
        {
          text: 'Number formatting',
          link: '/pages/usage/number-formatting',
        },
        {
          text: 'String formatting',
          link: '/pages/usage/string-formatting',
        },
        {
          text: 'Name formatting',
          link: '/pages/usage/name-formatting',
        },
      ],
    },
  ],
}
