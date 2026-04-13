import type { PackageDocNavigation } from '@docs/packages/navigation.utils'

export const I18N_FACTORY_NAVIGATION: PackageDocNavigation = {
  link: 'pages/getting-started/installation',
  title: 'i18n-factory',
  path: 'i18n-factory',
  sidebar: [
    {
      text: 'Getting Started',
      items: [
        {
          text: 'Installation',
          link: '/pages/getting-started/installation',
        },
      ],
    },
    {
      text: 'Guide',
      items: [
        {
          text: 'Overview',
          link: '/pages/guide/overview',
        },
        {
          text: 'Package Integration',
          link: '/pages/guide/package-integration',
        },
      ],
    },
  ],
}
