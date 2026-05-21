<script setup lang="ts">
import type { PermissionMatchType } from './permissionGuard.composable'
import { usePermissionGuard } from './permissionGuard.composable'
import type { RegisteredPermission } from './register.type'

const props = withDefaults(defineProps<{
  /**
   * Defines whether 'any' or 'all' permissions must be granted to render the slot.
   * any: at least one permission is sufficient.
   * all: all permissions must be granted.
   * @default 'any'
   */
  match?: PermissionMatchType
  /**
   * At least one of the permissions must be granted for the slot to render.
   * If multiple permissions are provided, depending on the `match` prop, either any or all permissions must be granted.
   */
  permission: `${RegisteredPermission}` | `${RegisteredPermission}`[]
}>(), {
  match: 'any',
})

const permissionGuard = usePermissionGuard()
</script>

<template>
  <slot v-if="permissionGuard.has(props.permission, props.match)" />
  <slot
    v-else
    name="fallback"
  />
</template>
