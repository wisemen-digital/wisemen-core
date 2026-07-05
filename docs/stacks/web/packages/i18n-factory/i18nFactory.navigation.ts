import type { PackageDocNavigation } from '@docs/navigation/navigation.utils'

export const I18N_FACTORY_NAVIGATION: PackageDocNavigation = {
  link: '/web/packages/i18n-factory/pages/getting-started/installation',
  title: 'I18n Factory',
  path: 'i18n-factory',
  sidebar: [
    {
      text: 'Getting Started',
      items: [
        {
          text: 'Installation',
          link: '/web/packages/i18n-factory/pages/getting-started/installation',
        },
      ],
    },
    {
      text: 'Guide',
      items: [
        {
          text: 'Overview',
          link: '/web/packages/i18n-factory/pages/guide/overview',
        },
        {
          text: 'Package Integration',
          link: '/web/packages/i18n-factory/pages/guide/package-integration',
        },
      ],
    },
  ],
}
