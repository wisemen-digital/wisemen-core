import { shallowRef } from 'vue'

import type { RegisteredPermission } from './register.type'

export type PermissionMatchType = 'all' | 'any'

const permissions = shallowRef<`${RegisteredPermission}`[]>([])

export function setPermissions(updatedPermissions: `${RegisteredPermission}`[]): void {
  permissions.value = updatedPermissions
}

/**
 * Check if the current user has the given permission. Can check for multiple permissions,
 * depending on the `match` parameter either any or all permissions must be granted.
 * @param permission The permission or permissions to check
 * @param match 'any': at least one of the permissions must be granted.
 *              'all': all permissions must be granted.
 * @returns boolean
 */
function hasPermission(
  permission: `${RegisteredPermission}` | `${RegisteredPermission}`[],
  match: PermissionMatchType = 'any',
): boolean {
  const hasAllPermissions = permissions.value.includes('all_permissions')

  if (hasAllPermissions) {
    return true
  }

  const permissionsToCheck = Array.isArray(permission)
    ? permission
    : [
        permission,
      ]

  if (match === 'any') {
    return permissionsToCheck.some(
      (p) => permissions.value.includes(p),
    )
  }

  return permissionsToCheck.every(
    (p) => permissions.value.includes(p),
  )
}

export function usePermissionGuard() {
  return {
    has: hasPermission,
  }
}
