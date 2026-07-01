# Type-safe permissions

By default, permission strings are typed as `string`. You can narrow the type to a union of your app's actual permissions by augmenting the `Register` interface — the same pattern used by `vue-router` and `vue-i18n`.

## Setup

Declare your permissions once in a `augmentLibraries.d.ts`

```typescript
// src/types/augmentLibraries.d.ts
import '@wisemen/vue-core-permissions'

declare module '@wisemen/vue-core-permissions' {
  interface Register {
    permission: 'user.read' | 'user.create' | 'user.delete' | 'role.read' | 'admin'
  }
}
```

After this, all permission arguments are narrowed to your union type and unknown strings become type errors.

## Result

```typescript
import { setPermissions, usePermissionGuard } from '@wisemen/vue-core-permissions'

// ✅ valid
setPermissions(['user.read', 'role.read'])

// ✅ valid
const permissionGuard = usePermissionGuard()
permissionGuard.has('admin')

// ❌ type error: '"unknown.permission"' is not assignable
permissionGuard.has('unknown.permission')
```

The same type narrowing applies to the `permission` prop on `PermissionGuard`:

```vue
<template>
  <!-- ❌ type error -->
  <PermissionGuard permission="unknown.permission">
    ...
  </PermissionGuard>
</template>
```