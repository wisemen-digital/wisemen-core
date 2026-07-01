import type { PackageDocNavigation } from '@docs/navigation/navigation.utils'

export const ACTIONS_NAVIGATION: PackageDocNavigation = {
  link: '/web/packages/actions/pages/getting-started/installation',
  title: 'Actions',
  path: 'actions',
  sidebar: [
    {
      text: 'Getting started',
      items: [
        {
          text: 'Installation',
          link: '/web/packages/actions/pages/getting-started/installation',
        },
      ],
    },
    {
      text: 'Concepts',
      items: [
        {
          text: 'What is an Action?',
          link: '/web/packages/actions/pages/concepts/actions',
        },
        {
          text: 'ActionContext',
          link: '/web/packages/actions/pages/concepts/action-context',
        },
      ],
    },
    {
      text: 'Usage',
      items: [
        {
          text: 'Overview',
          link: '/web/packages/actions/pages/usage/overview',
        },
        {
          text: 'Creating Actions',
          link: '/web/packages/actions/pages/usage/creating-actions',
        },
        {
          text: 'Models',
          link: '/web/packages/actions/pages/usage/models',
        },
        {
          text: 'Sub-Actions',
          link: '/web/packages/actions/pages/usage/sub-actions',
        },
        {
          text: 'Components',
          link: '/web/packages/actions/pages/usage/components',
        },
      ],
    },
  ],
}
