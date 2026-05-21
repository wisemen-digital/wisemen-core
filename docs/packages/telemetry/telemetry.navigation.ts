import type { PackageDocNavigation } from '@docs/packages/navigation.utils'

export const TELEMETRY_NAVIGATION: PackageDocNavigation = {
  link: 'pages/getting-started/installation',
  title: 'Telemetry',
  path: 'telemetry',
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
          text: 'Overview',
          link: '/pages/usage/overview',
        },
        {
          text: 'Instrumentation',
          link: '/pages/usage/instrumentation',
        },
        {
          text: 'Rationale',
          link: '/pages/usage/rationale',
        },
      ],
    },
  ],
}
