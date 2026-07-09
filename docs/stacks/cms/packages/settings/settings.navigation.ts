import type { PackageDocNavigation } from '#navigation/navigation.utils.ts'

export const PAYLOAD_SETTINGS_NAVIGATION: PackageDocNavigation = {
  link: '/cms/packages/settings/pages/getting-started/installation',
  title: 'Payload Settings',
  path: 'settings',
  sidebar: [
    {
      text: 'Getting started',
      items: [
        {
          text: 'Installation',
          link: '/cms/packages/settings/pages/getting-started/installation',
        },
      ],
    },
  ],
}
