# Creating Actions

## The composable pattern

Every action is defined inside a composable function (e.g. `useMyAction()`). This is the standard pattern because actions commonly depend on Vue composables — `useI18n`, `useRouter`, `useOverlay`, stores — that must be called during component setup.

```typescript
// filepath: src/actions/global/signOut.action.ts

import { createAction, useActionGroup } from '@wisemen/vue-core-actions'
import { LogOut01Icon } from '@wisemen/vue-core-icons'
import { useI18n } from 'vue-i18n'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/modules/auth'

export function useSignOutAction() {
  const i18n = useI18n()
  const router = useRouter()
  const authStore = useAuthStore()
  const actionGroup = useActionGroup()

  return createAction({
    id: 'sign-out',
    name: () => i18n.t('action.global.sign_out.name'),
    group: actionGroup.account,
    icon: () => LogOut01Icon,
    keyboardShortcut: { sequence: ['S', 'O'] },
    keywords: i18n.t('action.global.sign_out.keywords').split(' '),
    separatorGroup: 'signOut',
    execute: () => {
      authStore.logout()
      router.replace({ name: 'auth-login' })
    },
  })
}
```

Import `createAction` directly from `@wisemen/vue-core-actions`. The `Register` augmentation you set up in `augmentLibraries.d.ts` ensures every callback is automatically typed against your `AppActionContext`.

## Collecting global actions

Define a composable that returns all statically registered actions. Call it once from `AppActionsRegistrar`:

```typescript
// filepath: src/actions/global/index.ts

import { useSignOutAction } from './signOut.action'
import { usePreferencesAction } from './preferences.action'
import { useGoToSettingsAction } from './goToSettings.action'

export function useGlobalActions() {
  return [
    useSignOutAction(),
    usePreferencesAction(),
    useGoToSettingsAction(),
  ]
}
```

## Model-targeted actions

Actions that operate on a specific data record follow this pattern:

```typescript
// filepath: src/modules/contact/actions/contactUpdateDialog.action.ts

import { createAction, GroupPriority } from '@wisemen/vue-core-actions'
import { useOverlay } from '@wisemen/vue-core-design-system'
import { Edit01Icon } from '@wisemen/vue-core-icons'
import { useI18n } from 'vue-i18n'
import { usePermissionGuard } from '@/instances/permissions.instance'
import ContactUpdateFormDialog from '../use-cases/update/views/ContactUpdateFormDialog.vue'

export function useContactUpdateDialogAction() {
  const i18n = useI18n()
  const overlay = useOverlay()
  const permissionGuard = usePermissionGuard()
  const contactUpdateDialog = overlay.create(ContactUpdateFormDialog)

  return createAction({
    id: 'contact-update-dialog',
    isApplicable: (ctx) => permissionGuard.has('contact.update') && ctx.hasTargetedModelsOfType('Contact'),
    name: (ctx) => ctx.menuType === 'commandMenu'
      ? i18n.t('module.contact.actions.update.name_command_menu')
      : i18n.t('module.contact.actions.update.name'),
    group: {
      name: (ctx) => ctx.targetedModelOfTypeOrThrow('Contact').name,
      category: () => i18n.t('action_group.contact.name'),
      priority: GroupPriority.MODEL,
    },
    icon: () => Edit01Icon,
    keyboardShortcut: { 
      key: 'E' 
    },
    execute: (ctx) => {
      const contact = ctx.targetedModelOfTypeOrThrow('Contact')

      contactUpdateDialog.open({ 
        contactUuid: contact.uuid
      })
    },
  })
}
```

Key patterns shown here:

**Permission guard in `isApplicable`** — return `false` early if the user lacks the required permission. The action is hidden entirely:

```typescript
isApplicable: (ctx) => permissionGuard.has('contact.update') && ctx.hasTargetedModelsOfType('Contact'),
```

**`GroupPriority` enum** — use the `GroupPriority` enum instead of raw numbers for consistent ordering:

| Value | When to use |
|-------|-------------|
| `GroupPriority.MODEL` | Actions scoped to a specific record (edit, delete) |
| `GroupPriority.VIEW` | Actions scoped to the current page (export, bulk actions) |

**Dynamic group name** — setting the group `name` to a function that reads context makes the command menu show the targeted record's name as the section header:

```typescript
group: {
  name: (ctx) => ctx.targetedModelOfTypeOrThrow('Contact').name,
  priority: GroupPriority.MODEL,
}
```

**Different names per menu type** — use `ctx.menuType === 'commandMenu'` to show a more descriptive name in the command palette (where there is no visual context) and a shorter name in context menus:

```typescript
name: (ctx) => ctx.menuType === 'commandMenu'
  ? i18n.t('module.contact.actions.update.name_command_menu') // "Edit contact"
  : i18n.t('module.contact.actions.update.name')              // "Edit"
```

**Dialog via `useOverlay`** — use `overlay.create(DialogComponent)` to create a dialog controller. Call `.open(props)` inside `execute`:

```typescript
const contactUpdateDialog = overlay.create(ContactUpdateFormDialog)

execute: (ctx) => {
  const contact = ctx.targetedModelOfTypeOrThrow('Contact')
  contactUpdateDialog.open({ contactUuid: contact.uuid })
}
```

## Metadata-based actions

When an action targets data that is not a model (e.g. context supplied by the current page), use `ctx.metadata`:

```typescript
// filepath: src/modules/permission/actions/permissionRoleUpdateDialog.action.ts

export function usePermissionRoleUpdateDialogAction() {
  const permissionGuard = usePermissionGuard()
  const overlay = useOverlay()
  const permissionRoleUpdateDialog = overlay.create(PermissionRoleUpdateFormDialog)

  return createAction({
    id: 'permission-role-update-dialog',
    isApplicable: (ctx) => {
      if (!permissionGuard.has('role.update')) {
        return false
      }

      const role = ctx.metadata.permissions?.roleToUpdate ?? null

      return role !== null && !role.isSystemAdmin
    },
    execute: (ctx) => {
      const role = ctx.metadata.permissions!.roleToUpdate!
      permissionRoleUpdateDialog.open({ role })
    },
    group: {
      name: i18n.t('module.permission.overview.action_group_name'),
      priority: GroupPriority.VIEW,
    },
    icon: () => Edit01Icon,
  })
}
```

The page that provides this data registers it with `useActionManagerStore`:

```typescript
const manager = useActionManagerStore()

manager.registerMetadata({
  permissions: { 
    roleToUpdate: selectedRole.value 
  },
})

onBeforeUnmount(() => manager.unregisterMetadata('permissions'))
```

## Action groups

Use the built-in `useActionGroup()` composable for standard groups (general, navigation, account, preferences, developer). For domain-specific groups, define them inline on the action or as a shared constant:

```typescript
// Inline group (common for model actions)
group: {
  name: (ctx) => ctx.targetedModelOfTypeOrThrow('Contact').name,
  category: () => 'Contacts',
  priority: GroupPriority.MODEL,
}

// Shared group constant (common for view-level actions)
const overviewGroup: ActionGroup = {
  name: () => i18n.t('module.contact.overview.action_group_name'),
  category: () => i18n.t('action.category.view'),
  priority: GroupPriority.VIEW,
}
```

## Static registration

Register actions that should always be available from `AppActionsRegistrar`:

```typescript
// filepath: src/AppActionsRegistrar.vue

import { useActionRegistryStore, useActionShortcuts } from '@wisemen/vue-core-actions'
import { useGlobalActions } from '@/actions/global'

useActionShortcuts()

const registry = useActionRegistryStore()
registry.registerActions(...useGlobalActions())
```

## Temporary registration via composable

::: info
In most cases, you won't interact with this composable directly as it's built-in in the components.
:::

For actions that are only relevant on a specific page, use `useTemporaryActions`. It registers on mount and unregisters automatically on unmount:

```typescript
import { useTemporaryActions } from '@wisemen/vue-core-actions'

const deleteContactAction = useContactDeleteDialogAction()
const editContactAction = useContactUpdateDialogAction()

useTemporaryActions([deleteContactAction, editContactAction])
```

## Passing actions to table rows

For row-level actions in a table, pass them via the `:actions` and `:get-action-model` props rather than registering them globally. The table component handles focusing and context menu wiring:

```vue
<!-- filepath: src/modules/contact/use-cases/overview/components/ContactOverviewTable.vue -->

<script setup lang="ts">
import { useContactUpdateDialogAction } from '@/modules/contact/actions/contactUpdateDialog.action'
import { useContactDeleteDialogAction } from '@/modules/contact/actions/contactDeleteDialog.action'

const contactUpdateDialogAction = useContactUpdateDialogAction()
const contactDeleteDialogAction = useContactDeleteDialogAction()
</script>

<template>
  <UITable
    :actions="[contactUpdateDialogAction, contactDeleteDialogAction]"
    :get-action-model="(item) => ({
      modelName: 'Contact',
      key: item.uuid,
      ...item,
    })"
  />
</template>
```

`get-action-model` maps each row item to an `ActionModel`. The `modelName` and `key` fields are required; spread the rest of your domain model so actions can access it via `ctx.targetedModelOfTypeOrThrow('Contact')`.

This pattern does not use the global registry — the actions are only active while the table component is mounted and only target the row that was interacted with.
