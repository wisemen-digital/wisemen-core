import type { PackageDocNavigation } from '@docs/packages/navigation.utils'

export const TEMPLATE_NAVIGATION: PackageDocNavigation = {
  link: 'pages/getting-started/overview',
  title: 'Project Template',
  path: 'template',
  sidebar: [
    {
      text: 'Getting started',
      items: [
        {
          text: 'Overview',
          link: '/pages/getting-started/overview',
        },
      ],
    },
    {
      text: 'Structure',
      items: [
        {
          text: 'Project structure',
          link: '/pages/structure/project-structure',
        },
        {
          text: 'Naming conventions',
          link: '/pages/structure/naming-conventions',
        },
        {
          text: 'Feature modules',
          link: '/pages/structure/modules',
        },
        {
          text: 'API client',
          link: '/pages/structure/api-client',
        },
      ],
    },
    {
      text: 'Patterns',
      items: [
        {
          text: 'Theming',
          link: '/pages/patterns/theming',
        },
      ],
    },
  ],
}
