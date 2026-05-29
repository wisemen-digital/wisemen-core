# Adapters

Adapters are the bridge between `useCustomViewManager` and the actual page state. There are two kinds:

- **State adapters** — read and write individual pieces of page state (filters, search query, visible columns) to and from a view snapshot.
- **Storage adapters** — persist the full list of views somewhere (e.g. localStorage).

## State adapters

Each state adapter is an object that tells the view manager how to:

| Method | Purpose |
|---|---|
| `key` | The property name this adapter occupies inside `view.state` |
| `getCurrentState()` | Return the current live value |
| `getDefaultState()` | Return the state to apply when a view has no snapshot for this key (e.g. the view was created before the adapter was added) |
| `serialize(value)` | Convert the live value to something JSON-safe for storage |
| `deserialize(raw)` | Restore a stored value back to the live type |
| `apply(state)` | Push a stored snapshot value back into the live state |
| `isDirty(saved, current)` | Return `true` when the live state differs from the snapshot |

### Filter state adapter

Connects a `useFilters` instance from `@wisemen/vue-core-filters`.

```typescript
import {
  createCustomViewFilterStateAdapter,
  useCustomViewManager,
} from '@wisemen/vue-core-custom-views'

const filters = useContactOverviewFilters() // ReturnType<typeof useFilters>

useCustomViewManager({
  state: [
    createCustomViewFilterStateAdapter(filters),
  ],
  // ...
})
```

The adapter stores filter values under the `'filters'` key in `view.state`. When a stored view has no `filters` snapshot (e.g. it was created before this adapter was added), the adapter resets all filters to an empty state by default.

Pass `defaultFilterValues` if your filters should reset to a specific non-empty state instead:

```typescript
createCustomViewFilterStateAdapter(filters, { status: 'active' })
```

> `@wisemen/vue-core-filters` is an optional peer dependency. Install it only when you use this adapter.

### Search state adapter

Connects a `Search` object returned by `useSearch` from `@wisemen/vue-core-design-system`.

```typescript
import {
  createCustomViewSearchStateAdapter,
  useCustomViewManager,
} from '@wisemen/vue-core-custom-views'

const search = useSearch() // Returns a Search object with .search ref and .updateSearch()

useCustomViewManager({
  state: [
    createCustomViewSearchStateAdapter(search),
  ],
  // ...
})
```

The adapter stores the search string under the `'search'` key in `view.state`.

### Table columns state adapter

Connects a `useTableCustomizeColumns` instance from `@wisemen/vue-core-design-system`.

```typescript
import {
  createCustomViewTableColumnsStateAdapter,
  useCustomViewManager,
} from '@wisemen/vue-core-custom-views'

const customizeColumns = useTableCustomizeColumns({ ... })

useCustomViewManager({
  state: [
    createCustomViewTableColumnsStateAdapter(customizeColumns),
  ],
  // ...
})
```

The adapter stores the ordered list of visible column keys under the `'columns'` key in `view.state`.

### Custom state adapter

Use `createCustomViewStateAdapter` to connect any piece of reactive state.

```typescript
import { createCustomViewStateAdapter } from '@wisemen/vue-core-custom-views'
import { ref } from 'vue'

const sortField = ref<string>('name')
const sortDirection = ref<'asc' | 'desc'>('asc')

const sortAdapter = createCustomViewStateAdapter({
  key: 'sort',
  getCurrentState: () => ({ field: sortField.value, direction: sortDirection.value }),
  getDefaultState: () => ({ field: 'name', direction: 'asc' as const }),
  serialize: (state) => state,
  deserialize: (raw) => raw as { field: string; direction: 'asc' | 'desc' },
  apply: (state) => {
    sortField.value = state.field
    sortDirection.value = state.direction
  },
  isDirty: (saved, current) => JSON.stringify(saved) !== JSON.stringify(current),
})
```

`getDefaultState` is called when a stored view has no snapshot for this key — for example, a view that was created before this adapter was added. Return whatever state the adapter should apply in that case.

## Combining multiple adapters

Pass all adapters as an array. The view manager captures and restores each one independently.

```typescript
useCustomViewManager({
  state: [
    createCustomViewFilterStateAdapter(filters),
    createCustomViewSearchStateAdapter(search),
    createCustomViewTableColumnsStateAdapter(customizeColumns),
  ],
  // ...
})
```

The resulting `view.state` shape is derived from the adapters:

```typescript
// Inferred automatically via AdaptersToState<TAdapters>
{
  filters: FilterValues<TFilters>
  search: string
  columns: string[]
}
```

## Storage adapters

### Local storage adapter

`createCustomViewLocalStorageAdapter` persists views to `localStorage` via `@vueuse/core`'s `useLocalStorage`.

```typescript
import { createCustomViewLocalStorageAdapter } from '@wisemen/vue-core-custom-views'

useCustomViewManager({
  storageAdapter: createCustomViewLocalStorageAdapter('contact-overview-views'),
  // ...
})
```

Pass a unique `storageKey` per page so views from different pages don't overwrite each other.

### Custom storage adapter

Implement `CustomViewStorageAdapter` to back views with any storage mechanism (API, IndexedDB, etc.).

```typescript
import type { CustomViewStorageAdapter } from '@wisemen/vue-core-custom-views'
import type { CustomView } from '@wisemen/vue-core-custom-views'

function createApiStorageAdapter(userId: string): CustomViewStorageAdapter {
  return {
    load: (): CustomView[] => {
      // Return synchronously from a local cache; trigger a background refresh if needed.
      return cachedViews.value ?? []
    },
    save: (views: CustomView[]): void => {
      cachedViews.value = views
      saveViewsToApi(userId, views)
    },
  }
}
```

`load` is called once during composable setup and must return synchronously. Async loading patterns (e.g. fetching from an API) should populate a reactive cache first and then call `setActiveView` once the data arrives.
