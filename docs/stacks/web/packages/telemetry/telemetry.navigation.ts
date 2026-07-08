import type { PackageDocNavigation } from '@docs/navigation/navigation.utils'

export const TELEMETRY_NAVIGATION: PackageDocNavigation = {
  link: '/web/packages/telemetry/pages/getting-started/installation',
  title: 'Telemetry',
  path: 'telemetry',
  sidebar: [
    {
      text: 'Getting started',
      items: [
        {
          text: 'Installation',
          link: '/web/packages/telemetry/pages/getting-started/installation',
        },
      ],
    },
    {
      text: 'Usage',
      items: [
        {
          text: 'Overview',
          link: '/web/packages/telemetry/pages/usage/overview',
        },
        {
          text: 'Instrumentation',
          link: '/web/packages/telemetry/pages/usage/instrumentation',
        },
        {
          text: 'Rationale',
          link: '/web/packages/telemetry/pages/usage/rationale',
        },
      ],
    },
  ],
}
