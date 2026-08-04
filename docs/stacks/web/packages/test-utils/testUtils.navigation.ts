import type { PackageDocNavigation } from '@docs/navigation/navigation.utils'

export const TEST_UTILS_NAVIGATION: PackageDocNavigation = {
  link: '/web/packages/test-utils/pages/getting-started/installation',
  title: 'Test Utilities',
  path: 'test-utils',
  sidebar: [
    {
      text: 'Getting started',
      items: [
        {
          text: 'Installation',
          link: '/web/packages/test-utils/pages/getting-started/installation',
        },
      ],
    },
    {
      text: 'Usage',
      items: [
        {
          text: 'Async results',
          link: '/web/packages/test-utils/pages/usage/async-results',
        },
        {
          text: 'Service mocks',
          link: '/web/packages/test-utils/pages/usage/service-mocks',
        },
        {
          text: 'Browser configuration',
          link: '/web/packages/test-utils/pages/usage/browser-configuration',
        },
      ],
    },
  ],
}
