# usePermissionGuard composable

`usePermissionGuard` gives you imperative access to the permission check in `<script setup>` or plain TypeScript — useful when you need to conditionally run logic rather than conditionally render UI.

## Basic usage

```typescript
import { usePermissionGuard } from '@wisemen/vue-core-permissions'

const permissionGuard = usePermissionGuard()

if (permissionGuard.has('user.create')) {
  // perform action
}
```

## Checking multiple permissions

```typescript
const permissionGuard = usePermissionGuard()

// At least one must be granted (default)
const canManageUsers = permissionGuard.has(['user.create', 'admin'])

// All must be granted
const canExportBilling = permissionGuard.has(['user.read', 'role.read'], 'all')
```

## In a Vue component

```vue
<script setup lang="ts">
import { usePermissionGuard } from '@wisemen/vue-core-permissions'

const permissionGuard = usePermissionGuard()

function handleDelete() {
  if (!permissionGuard.has('user.delete')) {
    return
  }

  // proceed with delete
}
</script>
```

## API

### `usePermissionGuard()`

Returns an object with:

| Property | Signature | Description |
|---|---|---|
| `has` | `(permission: string \| string[], match?: 'any' \| 'all') => boolean` | Returns `true` when the required permission(s) are granted |
