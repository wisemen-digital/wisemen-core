# Components

`@wisemen/vue-core-filters` ships two components that read from the filters context provided by `useFilters`. Place them anywhere inside the same component tree where `useFilters` was called — no props required.

## `UIFiltersDropdownMenu`

A "Filter" button that opens an action picker listing all available filters. Selecting a filter activates it immediately (multi-select / multi-autocomplete) or opens the appropriate dialog (number, date range). Includes a "Clear filters" entry at the bottom when filters are active.

The button also registers the `F` keyboard shortcut to open the picker.

```vue
<script setup lang="ts">
import { UIFiltersDropdownMenu } from '@wisemen/vue-core-filters'
import { useContactOverviewFilters } from '../composables/contactOverviewFilters.composable'

const filters = useContactOverviewFilters()
</script>

<template>
  <UIFiltersDropdownMenu />
</template>
```

The component renders a secondary `UIButton` with the "Filter" label and a filter icon. No configuration is required — it picks up everything from context.

---

## `UIFiltersActive`

Renders a horizontal row of badges, one for each currently active filter. Each badge shows the filter label and its current value, and lets the user remove or edit the filter inline.

```vue
<template>
  <UIFiltersDropdownMenu />
  <UIFiltersActive />
</template>
```

The badges update reactively as filters are added, changed, or cleared. The row is empty (renders nothing visible) when no filters are active.

Badge behaviour per filter type:

| Filter type | Badge behaviour |
|-------------|-----------------|
| Multi-select / Multi-autocomplete | Shows the count of selected items. Clicking opens the picker to add or remove items |
| Boolean | Shows the true/false label. When `canBeToggled` is `true`, clicking toggles between the two states |
| Number | Shows the formatted value. Clicking reopens the number dialog |
| Date range | Shows the formatted date range. Clicking reopens the date range dialog |

---

## Full example

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

```vue
<!-- filepath: src/modules/contact/use-cases/overview/ContactOverviewView.vue -->

<script setup lang="ts">
import {
  UIFiltersActive,
  UIFiltersDropdownMenu,
} from '@wisemen/vue-core-filters'
import { useContactIndexQuery } from '@/modules/contact/api/queries/contactIndex.query'
import { useContactOverviewFilters } from '../composables/contactOverviewFilters.composable'

const filters = useContactOverviewFilters()

const { result } = useContactIndexQuery({
  params: {
    filters: filters.values,
  },
})
</script>

<template>
  <div>
    <UIFiltersActive />
    <UIFiltersDropdownMenu />

    <ContactTable
      :result="result"
      :active-filter-count="filters.activeFilters.value.length"
      @clear-filters="filters.clearAll()"
    />
  </div>
</template>
```
