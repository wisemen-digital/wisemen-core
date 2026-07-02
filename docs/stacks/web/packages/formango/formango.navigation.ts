import type { PackageDocNavigation } from '@docs/navigation/navigation.utils'

export const FORMANGO_NAVIGATION: PackageDocNavigation = {
  link: '/web/packages/formango/guide/getting-started',
  title: 'Formango',
  path: 'formango',
  sidebar: [
    {
      text: 'Guide',
      items: [
        {
          text: 'Getting Started',
          link: '/web/packages/formango/guide/getting-started',
        },
        {
          text: 'Devtools',
          link: '/web/packages/formango/guide/devtools',
        },
      ],
    },
    {
      text: 'API Reference',
      items: [
        {
          text: 'useForm',
          link: '/web/packages/formango/api/useForm',
        },
        {
          text: 'Field',
          link: '/web/packages/formango/api/field',
        },
        {
          text: 'Field Array',
          link: '/web/packages/formango/api/field-array',
        },
      ],
    },
    {
      text: 'Examples',
      items: [
        {
          text: 'Subforms',
          link: '/web/packages/formango/examples/subforms',
        },
        {
          text: 'External Errors',
          link: '/web/packages/formango/examples/external-errors',
        },
      ],
    },
    {
      text: 'Best Practices',
      items: [
        {
          text: 'Custom Input',
          link: '/web/packages/formango/best-practices/custom-input',
        },
        {
          text: 'i18n',
          link: '/web/packages/formango/best-practices/i18n',
        },
      ],
    },
  ],
}
