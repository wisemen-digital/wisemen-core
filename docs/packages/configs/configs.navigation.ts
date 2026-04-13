import type { PackageDocNavigation } from '@docs/packages/navigation.utils'

export const CONFIGS_NAVIGATION: PackageDocNavigation = {
  link: 'index',
  title: 'Vue Core Configs',
  path: 'configs',
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
      text: 'Guides',
      items: [
        {
          text: 'Vite',
          link: '/pages/guides/vite',
        },
        {
          text: 'Hey API',
          link: '/pages/guides/hey-api',
        },
        {
          text: 'Zod',
          link: '/pages/guides/zod',
        },
        {
          text: 'Vue Query',
          link: '/pages/guides/vue-query',
        },
        {
          text: 'Vue I18n',
          link: '/pages/guides/vue-i18n',
        },
        {
          text: 'Tailwind variants',
          link: '/pages/guides/tailwind-variants',
        },
      ],
    },
  ],
}
