import type { PackageDocNavigation } from '@docs/packages/navigation.utils'

export const ACTIONS_NAVIGATION: PackageDocNavigation = {
  link: 'pages/getting-started/installation',
  title: 'Actions',
  path: 'actions',
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
      text: 'Concepts',
      items: [
        {
          text: 'What is an Action?',
          link: '/pages/concepts/actions',
        },
        {
          text: 'ActionContext',
          link: '/pages/concepts/action-context',
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
          text: 'Creating Actions',
          link: '/pages/usage/creating-actions',
        },
        {
          text: 'Models',
          link: '/pages/usage/models',
        },
        {
          text: 'Sub-Actions',
          link: '/pages/usage/sub-actions',
        },
        {
          text: 'Components',
          link: '/pages/usage/components',
        },
      ],
    },
  ],
}
