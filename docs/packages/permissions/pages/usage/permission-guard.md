# PermissionGuard component

`PermissionGuard` is a renderless component that conditionally renders its slot based on the current user's permissions.

## Basic usage

```vue
<script setup lang="ts">
import { PermissionGuard } from '@wisemen/vue-core-permissions'
</script>

<template>
  <PermissionGuard permission="user.create">
    <button>Create user</button>
  </PermissionGuard>
</template>
```

The default slot is only rendered when the user has the required permission. Nothing is rendered otherwise.

## Fallback slot

Use the `fallback` named slot to render something when the permission is not granted.

```vue
<template>
  <PermissionGuard permission="user.create">
    <button>Create user</button>

    <template #fallback>
      <p>You do not have permission to create users.</p>
    </template>
  </PermissionGuard>
</template>
```

## Multiple permissions

Pass an array to require multiple permissions. By default, **any** one of them is sufficient.

```vue
<template>
  <!-- Renders if the user has 'user.create' OR 'admin' -->
  <PermissionGuard :permission="['user.create', 'admin']">
    <button>Create user</button>
  </PermissionGuard>
</template>
```

Use `match="all"` to require **all** permissions.

```vue
<template>
  <!-- Renders only if the user has BOTH 'user.create' AND 'billing.read' -->
  <PermissionGuard
    :permission="['user.create', 'billing.read']"
    match="all"
  >
    <button>Export invoices</button>
  </PermissionGuard>
</template>
```

## Props

| Prop | Type | Default | Description |
|---|---|---|---|
| `permission` | `string \| string[]` | — | Permission(s) to check |
| `match` | `'any' \| 'all'` | `'any'` | Whether any or all permissions must be granted |
