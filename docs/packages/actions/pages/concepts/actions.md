# What is an Action?

An **action** is a self-contained unit of work that the user can trigger — through a command menu, a context menu, a keyboard shortcut, or a button. Every action describes:

- **What it does** — its `execute` function
- **When it is visible** — via `isApplicable` and `disabledReason`
- **How it appears** — its `name`, `icon`, `hint`, `avatar`, and `group`
- **How to find it** — via `keywords`, `keyboardShortcut`, and search scoring options

Actions are plain objects that implement the `Action<TContext>` interface. They are **context-aware**: every callback receives the current `ActionContext`, giving it access to selected models, routing state, search input, and more.

## The Action interface

Actions are defined inside composable functions so they can capture Vue dependencies (i18n, router, stores, dialogs). The `createAction` helper is imported directly from `@wisemen/vue-core-actions`:

```typescript
import { createAction, GroupPriority } from '@wisemen/vue-core-actions'
import { usePermissionGuard } from '@wisemen/vue-core-permissions'
import { useOverlay } from '@wisemen/vue-core-design-system'
import { TrashIcon } from '@wisemen/vue-core-icons'
import ContactDeleteFormDialog from '../views/ContactDeleteFormDialog.vue'

export function useContactDeleteDialogAction() {
  const overlay = useOverlay()
  const permissionGuard = usePermissionGuard()
  const contactDeleteDialog = overlay.create(ContactDeleteFormDialog)

  return createAction({
    id: 'contact-delete-dialog',
    name: 'Delete contact',
    group: {
      name: (ctx) => ctx.targetedModelOfTypeOrThrow('Contact').name,
      priority: GroupPriority.MODEL,
    },
    icon: () => TrashIcon,
    isApplicable: (ctx) => permissionGuard.has('contact.delete') 
      && ctx.hasTargetedModelsOfType('Contact'),
    execute: (ctx) => {
      const contact = ctx.targetedModelOfTypeOrThrow('Contact')

      contactDeleteDialog.open({ 
        contactUuid: contact.uuid
      })
    },
  })
}
```

## Core fields

### `id` — stable identifier

A unique string (typically a UUID) that identifies this action across renders. Used for keyboard shortcut deduplication and sub-action pagination state. Generate it once at definition time:

```typescript
id: crypto.randomUUID()
```

### `name` — display label

The primary label shown in menus and search results. Can be a static string or a function that reads context — useful when the label should reflect the current selection:

```typescript
// Static
name: 'Archive project'

// Dynamic
name: (ctx) => {
  const count = ctx.targetedModelsOfType('project').length
  return count === 1 ? 'Archive project' : `Archive ${count} projects`
}
```

### `execute` — the action body

Called when the user activates the action. Receives the current `ActionContext`. May be `async`:

```typescript
execute: async (ctx) => {
  const project = ctx.targetedModelOfTypeOrThrow('project')
  await ProjectService.archive(project.id)
}
```

Omit `execute` entirely on parent actions that only serve as containers for sub-actions.

### `isApplicable` — visibility gating

Return `false` to hide the action completely. Evaluated once per render cycle. Use this to show actions only when the right model is selected:

```typescript
// Only show when a user is targeted
isApplicable: (ctx) => ctx.hasTargetedModelsOfType('user')
```

### `disabledReason` — greyed-out with tooltip

Return a string explaining why the action cannot run right now. The action remains visible but is greyed out, and the reason is shown as a tooltip:

Note: this requires `isApplicable` to be `true`.

```typescript
disabledReason: (ctx) => {
  const user = ctx.targetedModelOfType('user')
  if (user?.role === 'admin') {
    return 'Admin users cannot be deleted'
  }
}
```

Return `undefined` or `null` when the action is enabled.

### `group` — visual grouping and ordering

Assigns the action to a named group. Groups control the section label shown in the command menu and the relative sort order between actions from different groups. See [Action Groups](./action-context#action-groups).

```typescript
group: navigationGroup
```

### `hint` — secondary label

A short secondary string shown alongside the action name. Use it for extra context like a file path, a record ID, or a status badge:

```typescript
hint: (ctx) => ctx.targetedModelOfType('user')?.email ?? null
```

### `icon` — leading icon

A function returning a Vue component (or `null`):

```typescript
icon: () => TrashIcon
```

### `keywords` and `keywordsExactMatch` — search discoverability

`keywords` adds hidden search terms that boost discoverability via fuzzy matching. `keywordsExactMatch` boosts the score to `1.0` on an exact substring match:

```typescript
keywords: ['remove', 'erase'],
keywordsExactMatch: ['delete user'],
```

### `keyboardShortcut` — hotkey binding

Binds a global keyboard shortcut to the action. Two forms are supported:

```typescript
// Single hotkey (fires immediately)
keyboardShortcut: { key: 'D', meta: true }

// Key sequence (press g then s)
keyboardShortcut: { sequence: ['G', 'S'] }
```

Add `runWithInputFocus: true` to allow the shortcut to fire even when a text input is focused.

See [Keyboard Shortcuts](../usage/keyboard-shortcuts) for full details.

### `selected` — toggle indicator

When resolved to `true`, a checkmark is displayed. Use this for on/off toggle actions:

```typescript
selected: (ctx) => ctx.targetedModelOfType('user')?.emailNotifications ?? false
```

### `avatar` — user or entity avatar

Displays an avatar (with initials fallback) in place of an icon. Accepts `name`, `src`, and `logo` fields:

```typescript
avatar: (ctx) => {
  const user = ctx.targetedModelOfType('user')
  return user ? { name: user.name, src: user.avatarUrl } : null
}
```

### `availableWhenUnauthenticated`

By default, all actions are hidden when `isAuthenticated` is `false`. Set this to `true` to keep an action visible on unauthenticated views (e.g. the login page):

```typescript
availableWhenUnauthenticated: true
```

### `onlyVisibleThroughSearch`

When `true`, the action is hidden in the root menu (no search query) and only appears in search results:

```typescript
onlyVisibleThroughSearch: true
```

### `separatorGroup` — visual sections in context menus

Groups adjacent actions in a context or dropdown menu with a separator line between sections. Actions in the same group are rendered together; a separator appears when the group key changes:

```typescript
// Actions without separatorGroup → first section (no separator)
{ name: 'Edit', ... }

// Different group → separator rendered before this action
{ name: 'Archive', separatorGroup: 'status' }
{ name: 'Publish', separatorGroup: 'status' }

// Another group → another separator
{ name: 'Delete', separatorGroup: 'destructive' }
```

Has no effect when a search query is active.

## Sub-actions

Actions can have children. When the user selects a parent action, the menu drills down into its `subActions`. During a search, child actions are lifted to the top level with their parent and root context injected automatically.

See [Sub-Actions](../usage/sub-actions) for the full guide.

## Preview panel

Return a Vue component from `preview` to show a rich detail panel when the user presses the right arrow key while this action is focused:

```typescript
preview: (ctx) => {
  const user = ctx.targetedModelOfTypeOrThrow('user')

  return h(UserPreview, { user })
}
```
