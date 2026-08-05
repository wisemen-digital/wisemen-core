import type { PackageDocNavigation } from '@docs/navigation/navigation.utils'

export const ESLINT_NAVIGATION: PackageDocNavigation = {
  link: '/web/packages/eslint/pages/getting-started/installation',
  title: 'Linting',
  path: 'eslint',
  sidebar: [
    {
      text: 'Getting started',
      items: [
        {
          text: 'Installation',
          link: '/web/packages/eslint/pages/getting-started/installation',
        },
        {
          text: 'Oxlint',
          link: '/web/packages/eslint/pages/getting-started/oxlint',
        },
      ],
    },
    {
      text: 'Tools',
      items: [
        {
          text: 'ESLint Inspector',
          link: '/web/packages/eslint/pages/tools/eslint-inspector',
        },
      ],
    },
  ],
}
