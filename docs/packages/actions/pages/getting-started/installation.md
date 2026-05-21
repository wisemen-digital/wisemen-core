# Installation

Get `@wisemen/vue-core-actions` up and running in your project.

## 1. Install the package

::: code-group
```bash [pnpm]
pnpm install @wisemen/vue-core-actions
```
:::

## 2. Install peer dependencies

`@wisemen/vue-core-actions` requires Pinia and Vue Router:

::: code-group
```bash [pnpm]
pnpm install pinia vue-router
```
:::

## 3. Define your ActionContext types

Create a file that assembles your app's action context from the model maps of each module. This type is what all action callbacks receive as their argument.

```typescript
// filepath: src/actions/actions.type.ts

import type { Action, ActionContext } from '@wisemen/vue-core-actions'
import type { ContactActionModels } from '@/modules/contact'
import type { UserActionModels } from '@/modules/user'
import type { RoutesProcessed } from '@/types/vueRouter'
import type { AppMetadata } from '@/types/metadata'

type AppActionModelMap = ContactActionModels & UserActionModels

export type AppActionModel = AppActionModelMap[keyof AppActionModelMap]

export interface AppActionContext extends ActionContext<
  AppActionModelMap,    // typed model access (ctx.targetedModelOfType, etc.)
  RoutesProcessed,      // typed route names (ctx.isRouteActive)
  Partial<AppMetadata>  // arbitrary state (ctx.metadata)
> {}
```

## 4. Register your ActionContext via module augmentation

Augment the `Register` interface so the library knows which `ActionContext` type to use globally. The cleanest place to do this is a shared type declaration file alongside other library augmentations:

```typescript
// filepath: src/types/augmentLibraries.d.ts

import type { AppActionContext } from '@/actions/actions.type'

declare module '@wisemen/vue-core-actions' {
  interface Register {
    actionContext: AppActionContext
  }
}
```

If you are also augmenting other libraries (e.g. `@wisemen/vue-core-api-utils`, `@wisemen/vue-core-design-system`), keep all `declare module` blocks in this same file for consistency.

## 5. Create an AppActionsRegistrar component

Add a dedicated root component that registers all static actions and installs the keyboard shortcut listener. Mount it once near the root of your app:

```vue
<!-- filepath: src/AppActionsRegistrar.vue -->

<script setup lang="ts">
import { useActionRegistryStore, useActionShortcuts } from '@wisemen/vue-core-actions'
import { useGlobalActions } from '@/actions/global'

useActionShortcuts()

const registry = useActionRegistryStore()
registry.registerActions(...useGlobalActions())
</script>

<template>
  <div />
</template>
```

```vue
<!-- filepath: src/App.vue -->

<script setup lang="ts">
import AppActionsRegistrar from '@/AppActionsRegistrar.vue'
</script>

<template>
  <RouterView />
  <AppActionsRegistrar />
</template>
```

## 6. Mark users as authenticated

Actions are hidden from unauthenticated users by default. Call `setIsAuthenticated` after login and on app boot:

```typescript
import { setIsAuthenticated } from '@wisemen/vue-core-actions'

// After a successful login
setIsAuthenticated(true)

// On logout
setIsAuthenticated(false)
```

## 7. You're all set!

You now have:
- ✅ Fully typed `ActionContext` with your models, routes, and metadata
- ✅ Global keyboard shortcut support
- ✅ Authentication-aware action visibility

Head over to the [Concepts](../concepts/actions) section to learn what an action is, or jump straight to [Creating Actions](../usage/creating-actions) for practical examples.
