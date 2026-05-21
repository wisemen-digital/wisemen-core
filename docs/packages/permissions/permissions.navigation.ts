import type { PackageDocNavigation } from '@docs/packages/navigation.utils'

export const PERMISSIONS_NAVIGATION: PackageDocNavigation = {
  link: 'pages/getting-started/installation',
  title: 'Permissions',
  path: 'permissions',
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
          text: 'PermissionGuard component',
          link: '/pages/usage/permission-guard',
        },
        {
          text: 'usePermissionGuard composable',
          link: '/pages/usage/composable',
        },
        {
          text: 'Type-safe permissions',
          link: '/pages/usage/type-safe-permissions',
        },
      ],
    },
  ],
}
