# Sub-Actions

Sub-actions let you build **hierarchical menus**: when the user selects a parent action, the menu drills down into a list of child actions. During a search, child actions are **lifted** to the top level with their parent context injected automatically.

## Basic sub-actions

Return an array from the `subActions` factory. This is the most common form and runs synchronously:

```typescript
export function usePreferencesAction() {
  const preferencesDialog = usePreferencesDialog()

  return createAction({
    id: 'open-preferences',
    name: 'Preferences',
    icon: () => Sliders01Icon,
    keyboardShortcut: { sequence: ['O', 'P'] },
    searchSubActionsConfig: {
      placeholder: () => 'Search preferences...',
    },
    subActions: () => [
      createAction({
        id: 'general-preferences',
        name: 'General',
        execute: () => preferencesDialog.open('general'),
        group: actionGroup.preferences,
      }),
      createAction({
        id: 'appearance',
        name: 'Appearance',
        execute: () => preferencesDialog.open('appearance'),
        group: actionGroup.preferences,
      }),
    ],
  })
}
```

The `subActions` factory is called each time the menu re-renders. Keep it fast; use an async variant for network calls.

## Async sub-actions with multi-select

When the child list requires a network call, return a `Promise`. Combine with `multiSelectSubActions: true` to keep the menu open while the user toggles multiple items:

```typescript
export function useUserRolesUpdateAction() {
  const i18n = useI18n()
  const queryClient = useQueryClient()
  const userUpdateRolesMutation = useUserUpdateRolesMutation()

  return createAction({
    id: 'user-roles-update',
    isApplicable: (ctx) => {
      const user = ctx.targetedModelOfType('User')
      if (!permissionGuard.has('user.update') || user === null) return false
      return user.uuid !== authStore.getAuthUserOrThrow().uuid
    },
    name: (ctx) => ctx.menuType === 'commandMenu'
      ? i18n.t('module.user.actions.roles_update.name_command_menu')
      : i18n.t('module.user.actions.roles_update.name'),
    group: {
      name: (ctx) => ctx.targetedModelOfTypeOrThrow('User').email,
      priority: GroupPriority.MODEL,
    },
    icon: () => LockUnlocked01Icon,
    multiSelectSubActions: true,
    searchSubActionsConfig: {
      minLength: 0,
      placeholder: i18n.t('module.user.actions.roles_update.search_placeholder'),
    },
    subActions: async (ctx) => {
      const result = await queryClient.fetchQuery({
        staleTime: 60_000,
        queryFn: () => RoleService.getRoles(),
        queryKey: ['roleIndex'],
      })

      if (result.isErr()) return []

      const user = ctx.targetedModelOfTypeOrThrow('User')
      const selectedRolesUuids = shallowRef<RoleUuid[]>(user.roles.map((r) => r.uuid))

      return result.value.map((role) =>
        createAction({
          id: role.uuid,
          name: role.name,
          hint: role.isSystemAdmin ? 'All permissions' : `${role.permissions.length} permissions`,
          selected: () => selectedRolesUuids.value.includes(role.uuid),
          execute: async () => {
            // Toggle selection
            selectedRolesUuids.value = selectedRolesUuids.value.includes(role.uuid)
              ? selectedRolesUuids.value.filter((id) => id !== role.uuid)
              : [...selectedRolesUuids.value, role.uuid]

            await userUpdateRolesMutation.execute({
              body: { roleUuids: selectedRolesUuids.value },
              params: { userUuid: user.uuid },
            })
          },
        })
      )
    },
  })
}
```

Note the `shallowRef` inside `subActions`: it's created once per async call, so all the sub-action closures share the same reactive reference. This enables optimistic multi-select without a round-trip per toggle.

## Async sub-actions with streaming (AsyncGenerator)

For large or progressively-loaded lists, use an `AsyncGenerator`. The menu renders partial results as each `yield` arrives:

```typescript
subActions: async function* (ctx) {
  // Yield cached results immediately for snappy UX
  const cached = cache.get('members')
  if (cached) yield* cached.map(memberToAction)

  // Stream fresh results
  const stream = TeamService.streamMembers(ctx.searchInput)
  for await (const member of stream) {
    yield memberToAction(member)
  }
}
```

## Paginated sub-actions

When a list can have many pages, wrap the result in `SubActionsWithMeta` and provide `pagination.nextOffset`. The menu automatically reloads with the next offset when the user scrolls to the bottom:

```typescript
import type { SubActionsWithMeta } from '@wisemen/vue-core-actions'

const searchUsersAction = createAction({
  id: 'search-users',
  name: 'Assign to user',
  subActions: async (ctx): Promise<SubActionsWithMeta> => {
    const offset = ctx.getPaginationOffsetForSubActionId(searchUsersAction.id) ?? 0
    const pageSize = 20

    const { items, total } = await UserService.list({
      search: ctx.searchInput,
      offset,
      limit: pageSize,
    })

    return {
      actions: items.map(userToAction),
      pagination: { nextOffset: offset + pageSize < total ? offset + pageSize : null },
    }
  },
})
```

`nextOffset: null` signals there are no more pages.

## Search configuration

Control how sub-actions behave during a search with `searchSubActionsConfig`:

```typescript
searchSubActionsConfig: {
  // Minimum characters before sub-actions are searched during lifting. Default: 0.
  minLength: 2,
  // Maximum lifted results shown at the top level during search. Default: 10.
  maxResults: 5,
  // Placeholder text in the search input when drilling into this action.
  placeholder: () => i18n.t('action.assign_user.search_placeholder'),
}
```

## `nameAsParent` — breadcrumb label

When a parent action has a long or context-dependent name, set `nameAsParent` to provide a shorter label shown in the breadcrumb trail while the user is inside the sub-menu:

```typescript
return createAction({
  id: 'open-preferences',
  name: (ctx) => ctx.menuType === 'commandMenu' ? 'Open preferences...' : 'Preferences',
  nameAsParent: () => 'Preferences',
  subActions: () => [...],
})
```

## Multi-select sub-actions

Set `multiSelectSubActions: true` on the parent to keep the menu open while toggling child items. Each toggled child still calls `execute`; the menu only closes on Escape or clicking outside.

## `parentScoreInfluence`

When a child action is lifted to the top-level search, its fuzzy score is influenced by its parent's metadata by default. Control this with `parentScoreInfluence`:

```typescript
// Default: all parent context influences the score
parentScoreInfluence: 'all'

// Only the direct parent contributes
parentScoreInfluence: 'direct'

// Parents are fully excluded from scoring
parentScoreInfluence: 'none'
```

## Keyboard shortcuts on sub-actions

To register shortcuts defined on sub-actions globally (even when the parent menu is closed), set `subActionsHaveKeyboardShortcuts: true` on the parent. The `useActionShortcuts` composable will recursively resolve synchronous sub-actions and register their shortcuts:

```typescript
const projectActionsGroup = createAction({
  id: 'project-actions',
  name: 'Project',
  subActionsHaveKeyboardShortcuts: true,
  subActions: () => [archiveProjectAction, deleteProjectAction],
})
```
