import type { PackageDocNavigation } from '@docs/navigation/navigation.utils'

export const PERMISSIONS_NAVIGATION: PackageDocNavigation = {
  link: '/web/packages/permissions/pages/getting-started/installation',
  title: 'Permissions',
  path: 'permissions',
  sidebar: [
    {
      text: 'Getting started',
      items: [
        {
          text: 'Installation',
          link: '/web/packages/permissions/pages/getting-started/installation',
        },
      ],
    },
    {
      text: 'Usage',
      items: [
        {
          text: 'PermissionGuard component',
          link: '/web/packages/permissions/pages/usage/permission-guard',
        },
        {
          text: 'usePermissionGuard composable',
          link: '/web/packages/permissions/pages/usage/composable',
        },
        {
          text: 'Type-safe permissions',
          link: '/web/packages/permissions/pages/usage/type-safe-permissions',
        },
      ],
    },
  ],
}
