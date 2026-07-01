import type { PackageDocNavigation } from '#navigation/navigation.utils.ts'

export const EXAMPLE_NAVIGATION: PackageDocNavigation = {
  link: '/api/packages/example',
  title: 'Example',
  path: 'example',
  sidebar: [
    {
      text: 'Getting started',
      items: [
        {
          text: 'Installation',
          link: '/api/packages/example',
        },
      ],
    },
  ],
}
