# Components

The design system ships four components that wire actions into your UI. They handle context building, applicability checks, and model registration so you don't have to do it manually.

## `UIActionTrigger`

Executes a **single action** when the user clicks an element. It resolves the action's name, icon, and keyboard shortcut and exposes them as slot props so you can render any button style you want.

```vue
<UIActionTrigger
  v-slot="{ label, icon, keyboardShortcut, canExecute, isExecuting }"
  :action="contactCreateDialogAction"
  :current-context-only="false"
>
  <UIButton
    v-if="canExecute"
    :label="label"
    :icon-left="icon"
    :keyboard-shortcut="keyboardShortcut"
    :is-loading="isExecuting"
  />
</UIActionTrigger>
```

**Slot props:**

| Prop | Type | Description |
|------|------|-------------|
| `label` | `string` | Resolved action name |
| `icon` | `Component \| null` | Resolved icon component |
| `keyboardShortcut` | `KeyboardShortcut \| null` | The action's shortcut (for display only) |
| `canExecute` | `boolean` | Whether `isApplicable` currently returns `true` |
| `isExecuting` | `boolean` | Whether the action's `execute` is in progress |

**Props:**

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `action` | `Action` | — | The action to execute on click |
| `models` | `ActionModel[]` | `[]` | Models passed into the action context |
| `currentContextOnly` | `boolean` | — | See [currentContextOnly](#currentcontextonly) |

## `UIActionFocus`

Registers actions and models when its element is **hovered or focused**, and unregisters them when the pointer or focus leaves. Use this on table rows or list items so actions are available to the command menu only while that row is active.

```vue
<UIActionFocus
  :actions="[editAction, deleteAction]"
  :models="[{ modelName: 'Contact', key: item.uuid, ...item }]"
>
  <tr><!-- row content --></tr>
</UIActionFocus>
```

Internally this calls `useTemporaryActions` with `GroupPriority.HOVER` and `useFocusedModels` in controlled mode — registering on `mouseenter`/`focusin` and unregistering on `mouseleave`/`focusout`.

**Props:**

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `actions` | `Action[]` | — | Actions to register while this element is focused |
| `models` | `ActionModel[]` | `[]` | Models to register as focused models |

## `UIActionDropdownMenu`

Wraps a trigger element and opens a **click-triggered dropdown menu** listing applicable actions. The menu is not rendered at all when no actions are applicable — use the `#fallback` slot to render something in that case.

```vue
<UIActionDropdownMenu
  :actions="[editAction, deleteAction]"
  :models="[{ modelName: 'Contact', key: item.uuid, ...item }]"
  :current-context-only="true"
  popover-side="bottom"
  popover-align="end"
>
  <UIIconButton :icon="DotsVerticalIcon" label="Actions" />
</UIActionDropdownMenu>
```

Use the `parentAction` prop to show a single action's sub-actions as the menu content — useful for a button that opens a multi-select picker:

```vue
<UIActionDropdownMenu
  v-model:is-open="isDropdownOpen"
  :current-context-only="true"
  :parent-action="userRolesUpdateAction"
  :models="[{ modelName: 'User', key: user.uuid, ...user }]"
  popover-side="bottom"
  popover-align="start"
>
  <template #default>
    <UIButton :label="rolesLabel" />
  </template>

  <template #fallback>
    <UIText :text="noPermissionLabel" />
  </template>
</UIActionDropdownMenu>
```

**Props:**

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `actions` | `Action[]` | `[]` | Actions to list in the menu |
| `parentAction` | `Action` | — | When set, the menu shows this action's sub-actions instead of `actions` |
| `models` | `ActionModel[]` | `[]` | Models passed into the action context |
| `metadata` | `object` | — | Metadata passed into the action context |
| `currentContextOnly` | `boolean` | — | See [currentContextOnly](#currentcontextonly) |
| `isOpen` | `boolean` (v-model) | `false` | Two-way binding for open state |
| `popoverSide` | `'top' \| 'right' \| 'bottom' \| 'left'` | `'top'` | Popper placement side |
| `popoverAlign` | `'center' \| 'start' \| 'end'` | `'center'` | Popper alignment |

## `UIActionContextMenu`

Wraps content and opens a **right-click context menu** with applicable actions. The right-click target is whatever you place inside the default slot.

```vue
<UIActionContextMenu
  :actions="[editAction, deleteAction]"
  :models="[{ modelName: 'Contact', key: item.uuid, ...item }]"
  :current-context-only="true"
>
  <tr><!-- entire row is the right-click target --></tr>
</UIActionContextMenu>
```

**Props:**

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `actions` | `Action[]` | `[]` | Actions to list in the context menu |
| `parentAction` | `Action` | — | When set, shows this action's sub-actions |
| `models` | `ActionModel[]` | `[]` | Models passed into the action context |
| `metadata` | `object` | — | Metadata passed into the action context |
| `currentContextOnly` | `boolean` | — | See [currentContextOnly](#currentcontextonly) |

## `currentContextOnly`

All four components accept a `currentContextOnly` prop. This controls whether the actions are also registered in the **global registry** (making them available in the command menu and for global keyboard shortcuts), or kept local to just this component.

| Value | Behaviour |
|-------|-----------|
| `false` | Actions are registered globally via `useTemporaryActions`. They appear in the command menu and respond to keyboard shortcuts while this component is mounted. |
| `true` | Actions are **not** registered globally. They are only evaluated in the context of this specific component's menu. |

Use `currentContextOnly: true` for table row actions — each row has its own model, and registering all rows' actions globally would produce duplicate entries. Use `currentContextOnly: false` for page-level trigger buttons where you want the action to also be reachable from the command menu.

## How they work together in a table row

The standard pattern for a table that supports both a hover actions-cell button and a right-click context menu:

```vue
<!-- TableBodyRow.vue -->

<UIActionContextMenu
  :actions="actions"
  :models="actionModel ? [actionModel] : []"
  :current-context-only="true"
>
  <UIActionFocus
    :actions="actions"
    :models="actionModel ? [actionModel] : []"
  >
    <tr>
      <slot />

      <!-- The ⋯ button in the last cell -->
      <td>
        <UIActionDropdownMenu
          :actions="actions"
          :models="actionModel ? [actionModel] : []"
          :current-context-only="true"
          popover-side="bottom"
          popover-align="end"
        >
          <UIIconButton :icon="DotsVerticalIcon" label="Actions" />
        </UIActionDropdownMenu>
      </td>
    </tr>
  </UIActionFocus>
</UIActionContextMenu>
```

- **`UIActionContextMenu`** — right-click anywhere on the row to get the menu
- **`UIActionFocus`** — hovering the row registers the actions for the command menu (`GroupPriority.HOVER`) and marks the model as focused
- **`UIActionDropdownMenu`** on the ⋯ button — click to get the same actions in a positioned dropdown

In `UITable` this whole setup is handled automatically when you pass `:actions` and `:get-action-model`. You only need to compose these components manually when building custom list UIs outside of `UITable`.
