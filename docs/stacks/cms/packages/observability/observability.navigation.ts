import type { PackageDocNavigation } from '#navigation/navigation.utils.ts'

export const PAYLOAD_OBSERVABILITY_NAVIGATION: PackageDocNavigation = {
  link: '/cms/packages/observability/pages/getting-started/installation',
  title: 'Payload Observability',
  path: 'observability',
  sidebar: [
    {
      text: 'Getting started',
      items: [
        {
          text: 'Installation',
          link: '/cms/packages/observability/pages/getting-started/installation',
        },
      ],
    },
    {
      text: 'Guides',
      items: [
        {
          text: 'Logging and sampling',
          link: '/cms/packages/observability/pages/logging',
        },
        {
          text: 'Payload jobs',
          link: '/cms/packages/observability/pages/jobs',
        },
        {
          text: 'oRPC requests',
          link: '/cms/packages/observability/pages/orpc',
        },
        {
          text: 'OpenTelemetry',
          link: '/cms/packages/observability/pages/opentelemetry',
        },
      ],
    },
    {
      text: 'Reference',
      items: [
        {
          text: 'API reference',
          link: '/cms/packages/observability/pages/api',
        },
      ],
    },
  ],
}
