# Models

Models are the data records that actions operate on. Before an action can target a record, that record needs to be **registered with the Action Manager** so it becomes part of the `ActionContext`.

## Defining action models

Each module defines its own action model file. The model extends the domain index type and adds the two required fields: `modelName` (a string literal discriminator) and `key` (unique identifier):

```typescript
// filepath: src/modules/contact/actions/contactActionModels.ts

import type { ContactIndex } from '@/modules/contact/models/contact/index/contactIndex.model'

interface ContactActionModel extends ContactIndex {
  key: string
  modelName: 'Contact'
}

export interface ContactActionModels {
  Contact: ContactActionModel
}
```

```typescript
// filepath: src/modules/user/actions/userActionModels.ts

import type { UserIndex } from '@/modules/user/models/user/index/userIndex.model'

interface UserActionModel extends UserIndex {
  key: string
  modelName: 'User'
}

export interface UserActionModels {
  User: UserActionModel
}
```

## Assembling AppActionModelMap

In `actions.type.ts`, intersect all module action model maps into a single `AppActionModelMap`. This is what your `AppActionContext` and `ctx.targetedModelsOfType` are typed against:

```typescript
// filepath: src/actions/actions.type.ts

import type { ContactActionModels } from '@/modules/contact'
import type { UserActionModels } from '@/modules/user'
import type { EventLogActionModels } from '@/modules/event-log'

type AppActionModelMap = ContactActionModels & UserActionModels & EventLogActionModels

export type AppActionModel = AppActionModelMap[keyof AppActionModelMap]
```

Adding a new module's models is a one-line change here.

## Providing models from a table

The most common way to register models is through the `:actions` and `:get-action-model` props on `UITable`. This wires up context menus, focus tracking, and model targeting automatically for each row:

```vue
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

`get-action-model` receives each row item and returns an `ActionModel`. Spreading `...item` makes the full domain model available to actions via `ctx.targetedModelOfTypeOrThrow('Contact')`.

The `modelName` must match the string literal defined in the module's action model interface.

## Registering models manually

Outside of tables, use the composables directly.

### `useViewModels`

Registers all records currently displayed in the view. Actions can access them via `ctx.allModels` and the type-filtered helpers:

```typescript
import { computed } from 'vue'
import { useViewModels } from '@wisemen/vue-core-actions'

const props = defineProps<{ users: UserModel[] }>()

useViewModels(computed(() => props.users))
```

Pass a `ComputedRef<ActionModel[]>`. The list updates reactively and is unregistered when the component unmounts.

### `useFocusedModels`

::: info
In most cases, you won't interact with this composable directly as it's built-in in the components.
:::

Registers records that currently have keyboard or pointer focus. Returns explicit `register` and `unregister` methods for controlled activation:

```vue
<!-- filepath: src/components/UserRow.vue -->

<script setup lang="ts">
import { computed } from 'vue'
import { useFocusedModels } from '@wisemen/vue-core-actions'

const props = defineProps<{ user: UserModel; isSelected: boolean }>()

const { register, unregister } = useFocusedModels(
  computed(() => props.isSelected ? [props.user] : [])
)
</script>

<template>
  <tr @focus="register" @blur="unregister">
    <!-- row content -->
  </tr>
</template>
```

## Accessing models in actions

Inside any action callback, the context provides typed accessors:

```typescript
execute: (ctx) => {
  // Null-safe — returns the model or null
  const contact = ctx.targetedModelOfType('Contact')

  // Throws if no model is targeted (use when isApplicable already guards this)
  const contact = ctx.targetedModelOfTypeOrThrow('Contact')

  // All targeted records of this type
  const contacts = ctx.targetedModelsOfType('Contact')

  // Check without fetching
  if (ctx.hasTargetedModelsOfType('Contact')) { ... }
}
```

## How model context is assembled

When an action is triggered, the Action Manager builds the context from:

1. **Explicit models** — passed directly by the triggering component (e.g. the right-clicked table row)
2. **View models** — everything registered via `useViewModels`
3. **Focused models** — everything registered via `useFocusedModels`

All three are merged and deduplicated. Only the explicitly targeted set is in `ctx.models`; everything combined is in `ctx.allModels`.
