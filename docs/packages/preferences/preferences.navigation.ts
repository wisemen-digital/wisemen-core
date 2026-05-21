import type { PackageDocNavigation } from '@docs/packages/navigation.utils'

export const PREFERENCES_NAVIGATION: PackageDocNavigation = {
  link: 'pages/getting-started/installation',
  title: 'Preferences',
  path: 'preferences',
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
          text: 'Sections',
          link: '/pages/usage/sections',
        },
      ],
    },
  ],
}
