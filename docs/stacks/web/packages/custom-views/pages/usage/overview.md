# Overview

`@wisemen/vue-core-custom-views` lets users save named configurations of a page — active filters, search query, visible table columns — and switch between them with a click or a keyboard shortcut. Each view is persisted to storage and the active view is tracked in the URL.

## How it fits together

```
┌──────────────────────────────────────────────────────────────┐
│                  useCustomViewManager()                      │
│  Defines seed views, state adapters, and the storage         │
│  adapter. Returns reactive views, activeView, and actions.   │
│  Automatically provides the context to child components.     │
└──────────────────────────────────────────────────────────────┘
                         │
          ┌──────────────┴──────────────┐
          │                             │
          ▼                             ▼
┌──────────────────┐         ┌────────────────────────────┐
│  CustomViewList  │         │  State adapters             │
│                  │         │                             │
│  Renders view    │         │  Each adapter bridges a     │
│  tabs. Shows a   │         │  piece of page state        │
│  Save button     │         │  (filters, search, columns) │
│  when the active │         │  to the view snapshot.      │
│  view is dirty.  │         └────────────────────────────┘
└──────────────────┘
```

## Setting up useCustomViewManager

Call `useCustomViewManager` once in the page component or a dedicated composable. It accepts three options:

| Option | Type | Description |
|---|---|---|
| `seedViews` | `CustomView[]` | Views that exist by default (e.g. "All", "Mine"). Not overwritten by stored data. |
| `state` | `CustomViewStateAdapter[]` | Adapters that bridge page state (filters, search, columns) to the view snapshot. |
| `storageAdapter` | `CustomViewStorageAdapter` | Reads and writes views to storage (e.g. localStorage). |

```typescript
// filepath: src/modules/contact/use-cases/overview/composables/contactCustomViews.composable.ts

import {
  createCustomViewFilterStateAdapter,
  createCustomViewLocalStorageAdapter,
  createCustomViewSearchStateAdapter,
  CustomViewColor,
  CustomViewIcon,
  useCustomViewManager,
} from '@wisemen/vue-core-custom-views'

export function useContactCustomViews() {
  const filters = useContactOverviewFilters()
  const search = useContactOverviewSearch()

  return useCustomViewManager({
    seedViews: [
      {
        id: 'all',
        name: 'All contacts',
        isDefault: true,
        isEditable: false,
        color: CustomViewColor.DEFAULT,
        icon: CustomViewIcon.USER,
        state: {},
      },
    ],
    state: [
      createCustomViewFilterStateAdapter(filters),
      createCustomViewSearchStateAdapter(search),
    ],
    storageAdapter: createCustomViewLocalStorageAdapter('contact-overview-views'),
  })
}
```

`useCustomViewManager` automatically calls `useProvideCustomViewManagerContext`, so `CustomViewList` and the dialog actions can inject the context from anywhere in the same component tree.

## Rendering the view tabs

Place `CustomViewList` in your page layout. It renders a row of tabs, one per view, and shows a **Save** dropdown whenever the active view's state differs from what was last saved.

```vue
<!-- filepath: src/modules/contact/use-cases/overview/ContactOverviewView.vue -->

<script setup lang="ts">
import { CustomViewList } from '@wisemen/vue-core-custom-views'

const customViews = useContactCustomViews()
</script>

<template>
  <div>
    <CustomViewList />

    <ContactOverviewFilters />
    <ContactOverviewTable />
  </div>
</template>
```

## Seed views vs. user-created views

**Seed views** are the built-in views you define in `seedViews`. They are merged with stored views on load: a seed view is only added if no stored view with the same `id` already exists. Set `isEditable: false` to prevent users from deleting or renaming them.

**User-created views** are created via the **Save → Save as new view** action. They are always editable and are stored in the storage adapter.

## URL sync

### Active view

The active view ID is stored in the `?view` query parameter. Switching views updates the URL without a page reload, so links like `?view=my-view` always land on the right view.

If `?view` is absent or points to an unknown ID, the first view is used.

### Working state

Any unsaved changes to adapter state (filters, search query, column visibility, etc.) are automatically encoded into the `?view-state` query parameter as a base64 JSON string. This means:

- Refreshing the page restores the user's exact unsaved session.
- Navigating to a detail page and pressing back restores the state.
- Sharing the URL shares the current working state.

`?view-state` is cleared automatically when the user switches views, saves the current view, or deletes the active view.

## Discarding changes

When the active view is dirty, a **Discard changes** action becomes available. Wire it up next to the Save button using `useCustomViewRevertToSavedViewAction`:

```typescript
import { useCustomViewRevertToSavedViewAction } from '@wisemen/vue-core-custom-views'

const revertToSavedViewAction = useCustomViewRevertToSavedViewAction()
```

The action resets all adapter state back to the last saved snapshot for the active view and clears `?view-state` from the URL. It is only applicable (`isApplicable`) when `isDirty` is `true`, so it only appears in the command palette and action menus when there is something to discard.

## Keyboard shortcuts

Pressing **1–9** (or **Shift+1–9** on azerty keyboards) switches to the corresponding view by index. The shortcut is registered automatically — no extra wiring needed.

## Dirty detection

`isDirty` is `true` whenever the current state (as reported by each adapter's `getCurrentState`) differs from the snapshot stored in `activeView.state`. Each adapter defines its own equality check via `isDirty(saved, current)`. The view is dirty if *any* adapter reports a difference.

When the view is dirty, `?view-state` is present in the URL. When it is clean (either because no changes were made, or after saving or discarding), `?view-state` is absent.

## File structure

Keep the custom views composable alongside the other page-level composables:

```
src/modules/contact/use-cases/overview/
├── ContactOverviewView.vue
└── composables/
    ├── contactCustomViews.composable.ts   # wraps useCustomViewManager
    ├── contactOverviewFilters.composable.ts
    └── contactOverviewSearch.composable.ts
```
