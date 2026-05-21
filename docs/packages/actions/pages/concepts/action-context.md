# ActionContext

Every callback on an `Action` (including `execute`, `isApplicable`, `disabledReason`, `name`, `subActions`, and more) receives the current `ActionContext` as its only argument. This object is the single source of truth for everything the action needs to make decisions: which models are targeted, what route is active, what the user typed, and more.

## Type signature

```typescript
interface ActionContext<TModelMap, TRoutes, TMetadata> {
  // Models
  models: TModelMap[keyof TModelMap][]
  allModels: TModelMap[keyof TModelMap][]
  focusedModels: TModelMap[keyof TModelMap][]
  hasTargetedModelsOfType<K extends keyof TModelMap>(modelName: K): boolean
  targetedModelOfType<K extends keyof TModelMap>(modelName: K): TModelMap[K] | null
  targetedModelOfTypeOrThrow<K extends keyof TModelMap>(modelName: K): TModelMap[K]
  targetedModelsOfType<K extends keyof TModelMap>(modelName: K): TModelMap[K][]

  // Routing
  router: Router
  isRouteActive(routeName: TRoutes[number]['name'], exact?: boolean): boolean

  // Menu state
  searchInput: string
  menuType?: 'commandMenu' | 'contextualMenu'
  keyboardEvent?: KeyboardEvent
  hasActiveDialogs(): boolean

  // Metadata
  metadata: TMetadata

  // Sub-action pagination
  getPaginationOffsetForSubActionId(id: string): number | null
  subActionsMeta?: Record<string, number | null>
}
```

## Models

Models are the data records that actions operate on. Three model sets are available:

| Property | Description |
|----------|-------------|
| `models` | The explicitly targeted (selected) models — the primary set the action should work on |
| `allModels` | All models currently visible in the view, regardless of selection |
| `focusedModels` | Models with keyboard or pointer focus (a subset of `allModels`) |

### Filtering models by type

Use the type-safe helpers to narrow models to a specific type. Types are defined by your `TModelMap` (see [Installation](../getting-started/installation)):

```typescript
// Check if any user is targeted
isApplicable: (ctx) => ctx.hasTargetedModelsOfType('user')

// Get the first targeted user (returns null if none)
execute: (ctx) => {
  const user = ctx.targetedModelOfType('user')
  // ...
}

// Get the first targeted user, throws if missing
execute: (ctx) => {
  const user = ctx.targetedModelOfTypeOrThrow('user')
  // user is guaranteed to be a UserModel here
}

// Get all targeted users
execute: (ctx) => {
  const users = ctx.targetedModelsOfType('user')
  // users: UserModel[]
}
```

## Routing

### `isRouteActive(routeName, exact?)`

Returns `true` if the named route is currently active. By default uses a prefix match (any matched route in the hierarchy). Pass `exact: true` to require the current leaf route to match:

```typescript
// True if we are anywhere inside the 'users' section
isApplicable: (ctx) => ctx.isRouteActive('user-module')

// True only if we are exactly on the users index page
isApplicable: (ctx) => ctx.isRouteActive('user-overview', true)
```

Route names are typed against your registered `TRoutes`, so typos become TypeScript errors.

### `router`

The full Vue Router instance, available for programmatic navigation inside `execute`:

```typescript
execute: (ctx) => {
  ctx.router.push({ name: 'users.detail', params: { id: userId } })
}
```

## Menu state

### `searchInput`

The current query string the user has typed in the active menu. Empty string when no query is active. Useful when sub-actions need to propagate the search to a backend:

```typescript
subActions: async (ctx) => {
  const results = await UserService.search(ctx.searchInput)
  return results.map(userToAction)
}
```

### `menuType`

Indicates where the action was invoked from:

- `'commandMenu'` — the global command palette
- `'contextualMenu'` — a right-click or contextual dropdown
- `undefined` — invoked via keyboard shortcut or a button

```typescript
execute: (ctx) => {
  if (ctx.menuType === 'commandMenu') {
    // Slightly different UX for the command palette
  }
}
```

### `keyboardEvent`

The `KeyboardEvent` that triggered the action, when invoked via keyboard shortcut. Absent when triggered through a menu click.

### `hasActiveDialogs()`

Returns `true` if any dialog is currently open. Useful for keyboard shortcut actions that should not fire while a dialog is visible:

```typescript
isApplicable: (ctx) => !ctx.hasActiveDialogs()
```

## Metadata

`metadata` carries arbitrary key/value data registered by components via `useActionManagerStore().registerMetadata()`. Its shape is typed by the `TMetadata` parameter of your registered `ActionContext`.

This is the mechanism for passing arbitrary state (e.g. the active project ID, a filter value) into actions without coupling them to a specific store:

```typescript
// In a page component
const manager = useActionManagerStore()
onMounted(() => manager.registerMetadata({ projectId: route.params.id }))
onBeforeUnmount(() => manager.unregisterMetadata('projectId'))

// In an action
execute: (ctx) => {
  console.log(ctx.metadata.projectId)
}
```

## Sub-action pagination

When sub-actions support pagination (see [Sub-Actions](../usage/sub-actions)), the context carries the pagination state:

```typescript
getPaginationOffsetForSubActionId(id: string): number | null
```

Returns the stored page offset for the given action id, or `null` on the first call (no previous page). Use this inside `subActions` to fetch the next page:

```typescript
subActions: async (ctx) => {
  const offset = ctx.getPaginationOffsetForSubActionId(myAction.id) ?? 0
  const { items, nextOffset } = await UserService.list({ offset })

  return {
    actions: items.map(userToAction),
    pagination: { nextOffset },
  }
}
```

## Action Groups

`ActionGroup` controls how actions are labelled and sorted in the command menu. Define groups once and reference them from your actions:

```typescript
import type { ActionGroup } from '@wisemen/vue-core-actions'

export const usersGroup: ActionGroup = {
  name: () => 'Users',
  category: () => 'Navigation',
  priority: 10,
}
```

| Field | Description |
|-------|-------------|
| `name` | Label shown above the group in the command menu |
| `category` | Broader category label (may span multiple groups) |
| `priority` | Lower number = higher in the list |
| `icon` | Optional icon component for the group header |
| `showIfOnlyGroup` | Always show the group label, even when it's the only group visible |

The built-in `useActionGroup()` composable provides standard groups (general, navigation, account, preferences, developer) with pre-translated names.
