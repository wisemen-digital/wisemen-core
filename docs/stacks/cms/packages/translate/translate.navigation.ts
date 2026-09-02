import type { PackageDocNavigation } from '#navigation/navigation.utils.ts'

export const PAYLOAD_TRANSLATE_NAVIGATION: PackageDocNavigation = {
  link: '/cms/packages/translate/pages/getting-started/installation',
  title: 'Payload Translate',
  path: 'translate',
  sidebar: [
    {
      text: 'Getting started',
      items: [
        {
          text: 'Installation',
          link: '/cms/packages/translate/pages/getting-started/installation',
        },
        {
          text: 'Adapters',
          link: '/cms/packages/translate/pages/getting-started/adapters',
        },
        {
          text: 'Google Translate',
          link: '/cms/packages/translate/pages/getting-started/google-translate',
        },
        {
          text: 'DeepL',
          link: '/cms/packages/translate/pages/getting-started/deepl',
        },
        {
          text: 'Custom adapters',
          link: '/cms/packages/translate/pages/getting-started/custom-adapters',
        },
      ],
    },
  ],
}
