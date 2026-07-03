import type { PackageDocNavigation } from '@docs/navigation/navigation.utils'

export const ZOD_VALIDATION_NAVIGATION: PackageDocNavigation = {
  link: '/web/packages/zod-validation/pages/getting-started/installation',
  title: 'Zod Validation',
  path: 'zod-validation',
  sidebar: [
    {
      text: 'Getting started',
      items: [
        {
          text: 'Installation',
          link: '/web/packages/zod-validation/pages/getting-started/installation',
        },
      ],
    },
    {
      text: 'Usage',
      items: [
        {
          text: 'Phone Number Schema',
          link: '/web/packages/zod-validation/pages/usage/phone-number-schema',
        },
        {
          text: 'Translations',
          link: '/web/packages/zod-validation/pages/usage/translations',
        },
      ],
    },
  ],
}
