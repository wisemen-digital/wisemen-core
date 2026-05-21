# Overview

`@wisemen/vue-core-actions` consists of two main building blocks that work together: the **Action Registry** and the **Action Manager**.

## How the system fits together

```
┌──────────────────────────────────────────────────────┐
│                    Action Registry                   │
│  Holds all registered actions (static + temporary)   │
│                                                      │
│  registry.registerActions(...)  ← AppActionsRegistrar│
│  useTemporaryActions(...)        ← component-level   │
└──────────────────────────────────────────────────────┘
                        │
                        │ allActions()
                        ▼
┌──────────────────────────────────────────────────────┐
│                    Action Manager                    │
│  Holds runtime context (models, metadata, routing)   │
│                                                      │
│  UITable :get-action-model  ← table row models       │
│  useViewModels(...)          ← everything on screen  │
│  useFocusedModels(...)       ← keyboard-focused rows │
│  registerMetadata(...)       ← page-level state      │
└──────────────────────────────────────────────────────┘
                        │
                        │ actionContext(options)
                        ▼
┌──────────────────────────────────────────────────────┐
│              Command Menu / Context Menu              │
│  Pulls actions from the registry, resolves each      │
│  action against the current context, ranks and       │
│  filters the results, and renders the list.          │
└──────────────────────────────────────────────────────┘
```

## Action Registry

The registry (`useActionRegistryStore`) is a Pinia store that holds every action available in the application. It has two kinds of actions:

### Static actions

Registered once at startup via a dedicated `AppActionsRegistrar` component. These are always in scope — navigation actions, global preferences, sign-out, and any other app-wide commands.

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

Mount this once at the root of your app:

```vue
<!-- filepath: src/App.vue -->
<template>
  <RouterView />
  <AppActionsRegistrar />
</template>
```

### Temporary actions

Registered by components at runtime and automatically unregistered on unmount. Use `useTemporaryActions` for page-specific actions that should only appear while that page is active.

## Action Manager

The manager (`useActionManagerStore`) tracks the **runtime context** that actions receive when they execute. It answers: *"What is the application state right now?"*

### Model context

The most common way to wire up models is through the table's `:get-action-model` prop. This lets actions target the specific row a user right-clicked or selected without any manual registration:

```vue
<UITable
  :actions="[editAction, deleteAction]"
  :get-action-model="(item) => ({
    modelName: 'Contact',
    key: item.uuid,
    ...item,
  })"
/>
```

For non-table scenarios, `useViewModels` and `useFocusedModels` register models directly.

### Metadata

Arbitrary key/value data registered by a page so that actions can read it via `ctx.metadata`. Useful for passing page state to actions that don't have a model to target (e.g. a permission role that is the subject of the current page):

```typescript
const manager = useActionManagerStore()

onMounted(() => manager.registerMetadata({
  permissions: { roleToUpdate: selectedRole.value },
}))
onBeforeUnmount(() => manager.unregisterMetadata('permissions'))
```

## File structure

A typical project organises actions like this:

```
src/
├── actions/
│   ├── actions.type.ts          # AppActionContext, AppAction, AppActionModelMap
│   └── global/
│       ├── index.ts             # useGlobalActions() — collects all static actions
│       ├── signOut.action.ts
│       ├── preferences.action.ts
│       └── mainNavigation.action.ts
├── modules/
│   ├── contact/
│   │   └── actions/
│   │       ├── contactActionModels.ts
│   │       ├── contactCreateDialog.action.ts
│   │       ├── contactUpdateDialog.action.ts
│   │       └── contactDeleteDialog.action.ts
│   └── user/
│       └── actions/
│           ├── userActionModels.ts
│           └── userRolesUpdate.action.ts
├── types/
│   └── augmentLibraries.d.ts    # Register augmentation for all libraries
└── AppActionsRegistrar.vue      # Startup registration + useActionShortcuts
```

Each module owns its action models and action composables. The global `actions.type.ts` assembles the full `AppActionModelMap` from all modules.
