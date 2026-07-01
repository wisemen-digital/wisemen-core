import type { PackageDocNavigation } from '@docs/navigation/navigation.utils'

export const PREFERENCES_NAVIGATION: PackageDocNavigation = {
  link: '/web/packages/preferences/pages/getting-started/installation',
  title: 'Preferences',
  path: 'preferences',
  sidebar: [
    {
      text: 'Getting started',
      items: [
        {
          text: 'Installation',
          link: '/web/packages/preferences/pages/getting-started/installation',
        },
      ],
    },
    {
      text: 'Usage',
      items: [
        {
          text: 'Configuration',
          link: '/web/packages/preferences/pages/usage/configuration',
        },
        {
          text: 'Sections',
          link: '/web/packages/preferences/pages/usage/sections',
        },
      ],
    },
  ],
}
