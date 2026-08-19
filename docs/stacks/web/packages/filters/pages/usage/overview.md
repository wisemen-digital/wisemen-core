# Overview

`@wisemen/vue-core-filters` provides a type-safe, actions-integrated filter system for list and table views. Filters are defined once and automatically appear in the command menu, a dedicated dropdown button, and as removable active-filter badges — with no separate state management required.

## How it fits together

```
┌──────────────────────────────────────────────────────┐
│                    useFilters()                      │
│  Defines the available filters and their types.      │
│  Returns reactive values, an action, and helpers.    │
└──────────────────────────────────────────────────────┘
                        │
           ┌────────────┴────────────┐
           │                         │
           ▼                         ▼
┌──────────────────┐      ┌──────────────────────────┐
│ UIFiltersDropdown│      │    UIFiltersActive        │
│ Menu             │      │                           │
│ "Filter" button  │      │  Renders a badge for each │
│ that opens the   │      │  active filter. Badges    │
│ action picker.   │      │  allow editing or removing│
│                  │      │  individual filters.      │
└──────────────────┘      └──────────────────────────┘
```

## Actions integration

`useFilters` is built on top of `@wisemen/vue-core-actions`. It registers each filter as an action inside the `ActionGroup` you supply, so filters automatically appear in the command menu alongside your other actions. No separate wiring is needed.

The composable creates two built-in actions in that group:
- **Add filters** — a parent action whose sub-actions are the individual filters
- **Clear filters** — appears when at least one filter is active

## Reactive values

`useFilters` returns a `values` ref typed to the exact shape of the filters you defined. Pass it directly to your query composable as a ref — it updates reactively whenever the user changes a filter:

```typescript
const filters = useContactOverviewFilters()

const { result } = useContactIndexQuery({
  params: {
    filters: filters.values,  // Ref — the query re-runs whenever values change
  },
})
```

### Typing query params with `WithFilterQuery`

Use `WithFilterQuery<TFilters>` from `@wisemen/vue-core-api-utils` to type your query params model. The generic matches the shape of the values your filters produce:

```typescript
// filepath: src/modules/contact/models/contact/index/contactIndexQueryParams.model.ts

import type { WithFilterQuery, WithSearchQuery } from '@wisemen/vue-core-api-utils'

export interface ContactIndexQueryParams extends WithSearchQuery, WithFilterQuery<{
  isActive: boolean | null
}> {}
```

The keys and types in the `WithFilterQuery` generic must match the `key` and value type of each filter in `useFilters`. For example, a `createBooleanFilter({ key: 'isActive' })` produces a `boolean | null` value, so the query params type has `isActive: boolean | null`.

## Persisting filters in the URL

Pass `persistInUrl` to sync filter values to a URL query string, so they survive a page refresh or a shared link:

```typescript
export function useContactOverviewFilters() {
  return useFilters({
    actionGroup: { /* ... */ },
    filters: [ /* ... */ ],
    persistInUrl: true, // stored under the `filters` query key
  })
}
```

Pass a string instead of `true` to use a custom query key — useful when a page has multiple `useFilters` instances, or to avoid a key collision:

```typescript
useFilters({
  actionGroup: { /* ... */ },
  filters: [ /* ... */ ],
  persistInUrl: 'contact-filters',
})
```

`persistInUrl` is disabled by default, so existing `useFilters` calls are unaffected. It only syncs local changes into the URL — it doesn't also read the URL again while the page is open, so navigating with the browser's back/forward buttons won't restore a previous filter state.

> If you use `@wisemen/vue-core-custom-views`, disable `persistInUrl` — custom views owns the URL state for all its adapters via `?view-state`, and running both at once causes conflicts.

## Context

`useFilters` automatically provides a **filters context** to all descendant components. `UIFiltersActive` and `UIFiltersDropdownMenu` read from this context, so they just need to be placed somewhere inside the same component tree — no props required.

```vue
<script setup lang="ts">
const filters = useContactOverviewFilters()
</script>

<template>
  <div>
    <!-- Both components read from the context provided by useFilters -->
    <UIFiltersDropdownMenu />
    <UIFiltersActive />

    <ContactTable
      :active-filter-count="filters.activeFilters.value.length"
      @clear-filters="filters.clearAll()"
    />
  </div>
</template>
```

## File structure

Wrap `useFilters` in its own composable so the view stays lean and the filter definitions can be reused or tested independently:

```
src/modules/contact/use-cases/overview/
├── ContactOverviewView.vue                          # calls useContactOverviewFilters
├── components/
│   └── ContactOverviewTable.vue                    # receives activeFilterCount, emits clearFilters
└── composables/
    └── contactOverviewFilters.composable.ts        # wraps useFilters
```

```typescript
// filepath: src/modules/contact/use-cases/overview/composables/contactOverviewFilters.composable.ts

import { GroupPriority } from '@wisemen/vue-core-actions'
import {
  createBooleanFilter,
  createMultiSelectFilter,
  useFilters,
} from '@wisemen/vue-core-filters'

export function useContactOverviewFilters() {
  return useFilters({
    actionGroup: {
      name: () => 'Contacts',
      category: () => 'View',
      priority: GroupPriority.VIEW,
    },
    filters: [
      createMultiSelectFilter({
        key: 'status',
        label: 'Status',
        options: () => ['active', 'inactive'],
        displayFn: (value) => value,
      }),
      createBooleanFilter({
        key: 'isVerified',
        label: 'Verified',
        entityLabel: 'Contact',
        trueLabel: 'is',
        falseLabel: 'is not',
        canBeToggled: true,
      }),
    ],
  })
}
```
