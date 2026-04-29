---
name: table-usage
description: >
  VcTable compound component (VcTableRoot with gridTemplateColumns,
  VcTableScrollContainer, VcTableContent, VcTableHeader,
  VcTableHeaderCell with sort, VcTableBody, VcTableRow, VcTableCell,
  VcTableCellSkeleton), usePagination composable with route query sync
  and filter/search/sort state, PaginationParamsBuilder fluent API for
  building query params. Use when building data tables with pagination
  and sorting.
type: core
library: vue-core-components
library_version: "3.0.1"
requires:
  - config-setup
sources:
  - "wisemen-digital/wisemen-core:packages/web/components-next/src/components/table/index.ts"
  - "wisemen-digital/wisemen-core:packages/web/components-next/src/composables/pagination/pagination.composable.ts"
  - "wisemen-digital/wisemen-core:packages/web/components-next/src/composables/pagination/pagination.type.ts"
  - "wisemen-digital/wisemen-core:packages/web/components-next/src/utils/paginationParamsBuilder.util.ts"
---

# @wisemen/vue-core-components — Table Usage

## Setup

```vue
<script setup lang="ts">
import {
  VcTableRoot,
  VcTableScrollContainer,
  VcTableContent,
  VcTableHeader,
  VcTableHeaderCell,
  VcTableBody,
  VcTableRow,
  VcTableCell,
  VcTableCellSkeleton,
  usePagination,
} from '@wisemen/vue-core-components'

interface User {
  uuid: string
  name: string
  email: string
  status: 'active' | 'inactive'
}

const {
  paginationOptions,
  handlePageChange,
  handleSortChange,
  handleSearchChange,
} = usePagination<{ status: string }>({
  isRouteQueryEnabled: true,
  options: {
    pagination: { limit: 20 },
    sort: { key: 'name', order: 'asc' },
  },
})

// Pass paginationOptions to your query composable
const { result } = useUserList(paginationOptions)
</script>

<template>
  <VcTableRoot grid-template-columns="1fr 1fr 120px">
    <VcTableScrollContainer>
      <VcTableContent>
        <VcTableHeader>
          <VcTableHeaderCell
            sort-key="name"
            :active-sort="paginationOptions.sort"
            @sort="handleSortChange"
          >
            Name
          </VcTableHeaderCell>
          <VcTableHeaderCell>Email</VcTableHeaderCell>
          <VcTableHeaderCell>Status</VcTableHeaderCell>
        </VcTableHeader>

        <VcTableBody>
          <!-- Loading state -->
          <template v-if="result.isLoading()">
            <VcTableRow v-for="i in 5" :key="i">
              <VcTableCellSkeleton />
              <VcTableCellSkeleton />
              <VcTableCellSkeleton />
            </VcTableRow>
          </template>

          <!-- Data rows -->
          <template v-else-if="result.isOk()">
            <VcTableRow v-for="user in result.getValue()" :key="user.uuid">
              <VcTableCell>{{ user.name }}</VcTableCell>
              <VcTableCell>{{ user.email }}</VcTableCell>
              <VcTableCell>
                <VcBadge>{{ user.status }}</VcBadge>
              </VcTableCell>
            </VcTableRow>
          </template>
        </VcTableBody>
      </VcTableContent>
    </VcTableScrollContainer>
  </VcTableRoot>
</template>
```

VcTable uses CSS Grid — `gridTemplateColumns` maps directly to `grid-template-columns`. Each `VcTableHeaderCell` and `VcTableCell` fills one grid column in order.

## Core Patterns

### usePagination with route query sync

`usePagination` manages pagination, filtering, sorting, and search state. With `isRouteQueryEnabled: true`, all state is synced to URL query parameters — so refreshing the page or sharing the URL preserves the exact table state.

```typescript
const {
  paginationOptions,     // ComputedRef with pagination, filter, search, sort
  handlePageChange,      // Call when page changes (offset pagination)
  handleFilterChange,    // Call when a filter changes
  handleSearchChange,    // Call when search input changes
  handleSortChange,      // Call when column sort changes
  clearFilters,          // Reset all filters to defaults
} = usePagination<{ status: string; role: string }>({
  isRouteQueryEnabled: true,
  options: {
    pagination: { limit: 20 },
    sort: { key: 'createdAt', order: 'desc' },
    filter: { status: 'active' },
  },
})
```

The generic type parameter defines your filter shape. `paginationOptions` is a computed ref containing `{ pagination, filter, search, sort }` — pass it directly to your query composable.

### PaginationParamsBuilder for query params

When your API expects a specific query parameter format, use the builder to transform `paginationOptions` into API-ready params:

```typescript
import { PaginationParamsBuilder } from '@wisemen/vue-core-components'

function buildParams(options: PaginationOptions) {
  return new PaginationParamsBuilder(options)
    .withFilter('status', options.filter?.status)
    .withSearch(options.search)
    .withSort(options.sort)
    .withLimit(options.pagination.limit)
    .withOffset(options.pagination.offset)
    .build()
}

// For keyset pagination:
function buildKeysetParams(options: PaginationOptions) {
  return new PaginationParamsBuilder(options)
    .withKey(lastItemKey)
    .withLimit(options.pagination.limit)
    .buildKeyset()
}
```

### Sortable columns

Only columns with a `sort-key` prop are clickable for sorting. Pass the current sort state and handle changes:

```vue
<VcTableHeaderCell
  sort-key="email"
  :active-sort="paginationOptions.sort"
  @sort="handleSortChange"
>
  Email
</VcTableHeaderCell>
```

Clicking a sortable header toggles between ascending, descending, and no sort.

### Sticky columns

Pin the first or last column so they stay visible during horizontal scroll:

```vue
<VcTableRoot
  grid-template-columns="200px 1fr 1fr 1fr 120px"
  is-first-column-sticky
  is-last-column-sticky
>
  <!-- First column (name) and last column (actions) stay pinned -->
</VcTableRoot>
```

## Common Mistakes

### CRITICAL: Missing gridTemplateColumns

```vue
<!-- Columns have no width — table layout is completely broken -->
<VcTableRoot>
  <VcTableContent>
    <VcTableHeader>
      <VcTableHeaderCell>Name</VcTableHeaderCell>
    </VcTableHeader>
  </VcTableContent>
</VcTableRoot>
```

```vue
<VcTableRoot grid-template-columns="1fr 2fr 120px">
  <VcTableScrollContainer>
    <VcTableContent>
      <VcTableHeader>
        <VcTableHeaderCell>Name</VcTableHeaderCell>
      </VcTableHeader>
    </VcTableContent>
  </VcTableScrollContainer>
</VcTableRoot>
```

`gridTemplateColumns` is required — it's the CSS `grid-template-columns` value that defines column widths. Without it, the grid has no column definitions and the layout breaks. Also always wrap `VcTableContent` in `VcTableScrollContainer` for horizontal overflow handling.

Source: `src/components/table/VcTableRoot.vue` — `gridTemplateColumns` is a required prop.

### HIGH: Not syncing pagination to route query

```typescript
// Pagination resets to defaults when user navigates away and back
const { paginationOptions } = usePagination({
  isRouteQueryEnabled: false,
  options: { pagination: { limit: 20 } },
})
```

```typescript
// Pagination state preserved in URL — survives navigation and page refresh
const { paginationOptions } = usePagination({
  isRouteQueryEnabled: true,
  options: { pagination: { limit: 20 } },
})
```

With `isRouteQueryEnabled: false`, all pagination state (page, sort, filters, search) lives only in memory. Navigating to a detail page and pressing back resets the table to page 1. With `true`, state is serialized into URL query params and restored automatically.

Source: `src/composables/pagination/pagination.composable.ts` — reads from and writes to `useRoute().query`.

### HIGH: Mismatched column count

```vue
<!-- 3 columns defined but 4 cells per row — last cell wraps to next grid row -->
<VcTableRoot grid-template-columns="1fr 1fr 120px">
  <VcTableContent>
    <VcTableHeader>
      <VcTableHeaderCell>Name</VcTableHeaderCell>
      <VcTableHeaderCell>Email</VcTableHeaderCell>
      <VcTableHeaderCell>Status</VcTableHeaderCell>
      <VcTableHeaderCell>Actions</VcTableHeaderCell>  <!-- Extra! -->
    </VcTableHeader>
  </VcTableContent>
</VcTableRoot>
```

```vue
<VcTableRoot grid-template-columns="1fr 1fr 120px 80px">
  <!-- 4 columns defined = 4 cells per row -->
</VcTableRoot>
```

The number of `VcTableHeaderCell` and `VcTableCell` elements per row must match the number of columns in `gridTemplateColumns`. Extra cells wrap to the next CSS grid row, breaking the table layout.

## See Also

- [config-setup](../config-setup/SKILL.md) — VcConfigProvider pagination defaults
- [form-field-usage](../form-field-usage/SKILL.md) — form inputs for table filter/search
