# Installation

`@wisemen/vue-core-permissions` provides a composable and a renderless component for permission-based rendering in Vue 3 apps.

## Install the package

::: code-group
```bash [pnpm]
pnpm install @wisemen/vue-core-permissions
```

```bash [npm]
npm install @wisemen/vue-core-permissions
```

```bash [yarn]
yarn add @wisemen/vue-core-permissions
```
:::

## Set up permissions

Call `setPermissions` once you have the user's permissions — typically after login or after fetching the current user from your API.

```typescript
import { setPermissions } from '@wisemen/vue-core-permissions'

// After login / user fetch
setPermissions(user.permissions)
```

Permissions are stored in a global `shallowRef`. You can call `setPermissions` again at any time to update them (e.g. on role change or logout).

::: tip Special permission
Passing `'all_permissions'` in the array grants access to everything — useful for super-admin roles.
:::

## Next steps

- [PermissionGuard component](../usage/permission-guard) — conditionally render UI based on permissions
- [usePermissionGuard composable](../usage/composable) — check permissions imperatively in scripts
- [Type-safe permissions](../usage/type-safe-permissions) — get autocompletion for your permission strings
