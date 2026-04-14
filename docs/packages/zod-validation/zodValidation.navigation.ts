import type { PackageDocNavigation } from '@docs/packages/navigation.utils'

export const ZOD_VALIDATION_NAVIGATION: PackageDocNavigation = {
  link: 'index',
  title: 'Zod Validation',
  path: 'zod-validation',
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
          text: 'Phone Number Schema',
          link: '/pages/usage/phone-number-schema',
        },
        {
          text: 'Translations',
          link: '/pages/usage/translations',
        },
      ],
    },
  ],
}
