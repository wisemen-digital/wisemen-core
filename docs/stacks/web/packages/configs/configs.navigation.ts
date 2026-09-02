import type { PackageDocNavigation } from '@docs/navigation/navigation.utils'

export const CONFIGS_NAVIGATION: PackageDocNavigation = {
  link: '/web/packages/configs/pages/getting-started/installation',
  title: 'Configurations',
  path: 'configs',
  sidebar: [
    {
      text: 'Getting started',
      items: [
        {
          text: 'Installation',
          link: '/web/packages/configs/pages/getting-started/installation',
        },
      ],
    },
    {
      text: 'Guides',
      items: [
        {
          text: 'Vite',
          link: '/web/packages/configs/pages/guides/vite',
        },
        {
          text: 'Hey API',
          link: '/web/packages/configs/pages/guides/hey-api',
        },
        {
          text: 'Zod',
          link: '/web/packages/configs/pages/guides/zod',
        },
        {
          text: 'Vue Query',
          link: '/web/packages/configs/pages/guides/vue-query',
        },
        {
          text: 'Vue I18n',
          link: '/web/packages/configs/pages/guides/vue-i18n',
        },
        {
          text: 'Tailwind variants',
          link: '/web/packages/configs/pages/guides/tailwind-variants',
        },
      ],
    },
  ],
}
