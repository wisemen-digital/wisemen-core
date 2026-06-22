# Filter types

Each filter is defined using a factory function that sets the `type` field and enforces the correct options. Pass the resulting objects as the `filters` array to `useFilters`.

::: tip Label convention
Filter labels should always be **singular** — use `'User'`, `'Project'`, `'Status'`, not `'Users'`, `'Projects'`, `'Statuses'`.
:::

## `useFilters` — quick reference

```typescript
import { GroupPriority } from '@wisemen/vue-core-actions'
import { useFilters } from '@wisemen/vue-core-filters'

export function useContactOverviewFilters() {
  return useFilters({
    actionGroup: {
      name: () => 'Contacts',
      category: () => 'View',
      priority: GroupPriority.VIEW,
    },
    filters: [...],
  })
}
```

**Return values:**

| Property | Type | Description |
|----------|------|-------------|
| `action` | `Action` | The "Add filters" action — pass to `UIFiltersDropdownMenu` or a command menu |
| `actionGroup` | `ActionGroup` | The action group that was passed in, re-exported for convenience |
| `activeFilters` | `ComputedRef<FilterWithAction<Filter>[]>` | Filters that currently have a non-default value |
| `clearAll` | `() => void` | Resets all non-persistent filters to their default values |
| `clearFilter` | `(key, onlyIfEmpty?) => void` | Resets a single filter by key; no-ops on persistent filters |
| `setOpenFilter` | `(key \| null) => void` | Marks a filter as "open" so it stays in `activeFilters` while being edited |
| `values` | `Ref<FilterValues<TFilters>>` | Reactive map of filter keys to their current values, fully typed |

---

## Multi-select

Lets the user pick one or more items from a static list. Values are toggled: selecting an already-selected item deselects it.

```typescript
import { createMultiSelectFilter } from '@wisemen/vue-core-filters'

createMultiSelectFilter({
  key: 'status',
  label: 'Status',
  options: () => ['active', 'inactive', 'pending'],
  displayFn: (value) => value,
})
```

**Options:**

| Option | Type | Required | Description |
|--------|------|----------|-------------|
| `key` | `string` | ✓ | Unique identifier, used as the key in `values` |
| `label` | `string` | ✓ | Display name in the filter picker |
| `options` | `(search: string) => TValue[]` | ✓ | Returns the list of selectable items, optionally filtered by the search input |
| `displayFn` | `(value: TValue) => string` | ✓ | Converts a value to the string shown in the badge and picker |
| `defaultValue` | `TValue[]` | | Initial value. Defaults to `[]` |
| `icon` | `Component` | | Icon shown in the action picker |
| `isPersistent` | `boolean` | | When `true`, the filter is always shown in `activeFilters`, cannot be removed by `clearFilter` or `clearAll`, and its badge appears before non-persistent filters |
| `disableOperators` | `boolean` | | Hides the operator dropdown in the active filter badge. Use when the backend only supports a single operator |

---

## Multi-autocomplete

Like multi-select, but `options` is async and supports paginated results. Use this when the list of options is fetched from an API.

```typescript
import { createMultiAutocompleteFilter } from '@wisemen/vue-core-filters'
import { Users01Icon } from '@wisemen/vue-core-icons'
import { useQueryClient } from '@tanstack/vue-query'
import { ApiUtil } from '@wisemen/vue-core-api-utils'

const queryClient = useQueryClient()

createMultiAutocompleteFilter({
  key: 'users',
  label: 'User',
  icon: Users01Icon,
  displayFn: (user) => user.email,
  options: async (searchInput, getPaginationOffsetForSubActionId) => {
    const paginationKey = getPaginationOffsetForSubActionId('users') ?? null

    const result = await queryClient.fetchQuery({
      staleTime: Number.POSITIVE_INFINITY,
      queryFn: () => UserService.getSearchCollectionResults(searchInput, paginationKey),
      queryKey: ['users', searchInput, paginationKey],
    })

    if (result.isErr()) {
      return []
    }

    return {
      items: result.value.data,
      pagination: {
        nextOffset: ApiUtil.getKeysetPaginationNextOffset(result.value.meta),
      },
    }
  },
})
```

**Options:**

| Option | Type | Required | Description |
|--------|------|----------|-------------|
| `key` | `string` | ✓ | Unique identifier |
| `label` | `string` | ✓ | Display name |
| `options` | `(searchInput, getPaginationOffsetForSubActionId) => Promise<TValue[] \| { items, pagination }>` | ✓ | Async function returning items. Return the paginated form to enable infinite scroll in the picker |
| `displayFn` | `(value: TValue) => string` | ✓ | Converts a value to a display string |
| `defaultValue` | `TValue[]` | | Defaults to `[]` |
| `icon` | `Component` | | Icon shown in the action picker |
| `isPersistent` | `boolean` | | See multi-select |
| `disableOperators` | `boolean` | | See multi-select |

---

## Boolean

A toggle filter with explicit true/false labels and an optional entity description. The value is `true`, `false`, or `null` (inactive).

```typescript
import { createBooleanFilter } from '@wisemen/vue-core-filters'

createBooleanFilter({
  key: 'isVerified',
  label: 'Verified',
  entityLabel: 'Contact',
  trueLabel: 'is',
  falseLabel: 'is not',
  canBeToggled: true,
})
```

When `canBeToggled` is `true`, the active-filter badge shows a toggle so the user can flip between `true` and `false` without removing the filter first.

**Options:**

| Option | Type | Required | Description |
|--------|------|----------|-------------|
| `key` | `string` | ✓ | Unique identifier |
| `label` | `string` | ✓ | Display name |
| `entityLabel` | `string` | ✓ | Describes what the filter applies to, e.g. `"User is disabled"` |
| `trueLabel` | `string` | ✓ | Label for the `true` state |
| `falseLabel` | `string` | ✓ | Label for the `false` state |
| `canBeToggled` | `boolean` | ✓ | Whether the badge lets the user toggle between true/false |
| `badgeLabel` | `string` | | Overrides the label shown in the active-filter badge |
| `defaultValue` | `boolean \| null` | | Defaults to `null` (inactive) |
| `icon` | `Component` | | Icon shown in the action picker |
| `isPersistent` | `boolean` | | See multi-select |
| `disableOperators` | `boolean` | | See multi-select |
| `trueOperatorLabel` | `string` | | Overrides "is" in the badge and dropdown. Use when "is" reads unnaturally, e.g. `"has"` → "Parking spot has charger" |
| `falseOperatorLabel` | `string` | | Overrides "is not" in the badge and dropdown. E.g. `"has no"` → "Parking spot has no charger" |

---

## Number

Opens a dialog where the user enters a numeric value. Supports unit display and `Intl.NumberFormat` formatting.

The active-filter badge shows an operator dropdown with four options: `=`, `≠`, `≥`, `≤`. The current value is a `NumberFilterValue` object:

```typescript
interface NumberFilterValue {
  operator: NumberFilterOperator // 'equals' | 'not_equals' | 'greater_than_or_equals' | 'less_than_or_equals'
  value: number | null
}
```

```typescript
import { createNumberFilter } from '@wisemen/vue-core-filters'

createNumberFilter({
  key: 'minAge',
  label: 'Minimum age',
  min: 0,
  max: 120,
  step: 1,
  placeholder: 'Enter age...',
})
```

**Options:**

| Option | Type | Required | Description |
|--------|------|----------|-------------|
| `key` | `string` | ✓ | Unique identifier |
| `label` | `string` | ✓ | Display name |
| `min` | `number` | | Minimum allowed value |
| `max` | `number` | | Maximum allowed value |
| `step` | `number` | | Input step increment |
| `placeholder` | `string` | | Input placeholder text |
| `formatOptions` | `Intl.NumberFormatOptions` | | Formatting applied to the value in the badge |
| `customUnit` | `string` | | Unit suffix for cases not covered by `Intl.NumberFormat` (e.g. `"px"`) |
| `defaultValue` | `NumberFilterValue` | | Defaults to `{ operator: 'equals', value: null }` (inactive) |
| `icon` | `Component` | | Icon shown in the action picker |
| `isPersistent` | `boolean` | | See multi-select |
| `disableOperators` | `boolean` | | See multi-select |

---

## Date

Opens a date picker dialog. The value is a `Temporal.PlainDate` (or `null` when unset).

```typescript
import { createDateFilter } from '@wisemen/vue-core-filters'

createDateFilter({
  key: 'date',
  label: 'Date',
})
```

When `isPersistent` is `true`, the badge shows prev/next navigation arrows and a "Today" shortcut. The navigation step is determined automatically: a single-day value navigates by day; a full calendar week navigates by week; a full calendar month navigates by month; a full calendar year navigates by year; anything else navigates by the same number of days as the selected range.

**Options:**

| Option | Type | Required | Description |
|--------|------|----------|-------------|
| `key` | `string` | ✓ | Unique identifier |
| `label` | `string` | ✓ | Display name |
| `defaultValue` | `PlainDate \| null` | | Defaults to `null` (inactive) |
| `icon` | `Component` | | Icon shown in the action picker |
| `isPersistent` | `boolean` | | See multi-select |
| `disableOperators` | `boolean` | | See multi-select |

---

## Date range

Opens a date range picker dialog. The value is a `PlainDateRange` from `@wisemen/vue-core-dates` — a `{ from, until }` object with `Temporal.PlainDate` values (or `null` when unset).

```typescript
import { createDateRangeFilter } from '@wisemen/vue-core-filters'

createDateRangeFilter({
  key: 'createdAt',
  label: 'Created at',
})
```

When `isPersistent` is `true`, the badge shows prev/next navigation arrows (same smart step logic as the date filter). If `from` and `until` are the same day, only a single date is shown in the badge.

**Options:**

| Option | Type | Required | Description |
|--------|------|----------|-------------|
| `key` | `string` | ✓ | Unique identifier |
| `label` | `string` | ✓ | Display name |
| `defaultValue` | `PlainDateRange` | | Defaults to `{ from: null, until: null }` (inactive) |
| `icon` | `Component` | | Icon shown in the action picker |
| `isPersistent` | `boolean` | | See multi-select |
| `disableOperators` | `boolean` | | See multi-select |