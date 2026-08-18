# Migrating from `Table` to `DataTable`

`ui/table/` (`UITable`) and `ui/data-table/` (`UIDataTable`) both ship today. Nothing is
deprecated at the compiler level and there is no codemod — migrate a table when you're already
touching it, not as a sweep.

Read `DATA_TABLE.md` first for what `DataTable` *is*. This file only covers the delta: what
changes, what has no equivalent, and what to do about it.

## The one concept that changes everything

The old table asked you for **a Vue component per cell**. The new one asks you for **a
description of the value**, and owns the rendering.

```ts
// Before — you build and return a component
{
  headerLabel: 'Name',
  key: 'name',
  component: (item) => markRaw(defineComponent({
    setup: () => () => h(UITableBodyRowCell, null, {
      default: () => h(UITableBodyRowCellText, { text: item.name, isPrimaryCell: true }),
    }),
  })),
}

// After — you describe the value, DataTable renders it
createDataTableTextCell({
  headerLabel: 'Name',
  key: 'name',
  value: (item) => ({ value: item.name }),
})
```

This is what makes the same column definition reusable in the mobile card and (eventually) the
detail pane. It's also the migration's main cost: **every hand-built cell component has to become
a Cell definition**, and if no built-in cell type fits, a `custom` cell.

Never hand-write `{ cell, cellType }` — always call a `createDataTableXCell` factory. The factory
keeps the two in sync structurally; a hand-assembled pair can drift.

Cell types available: `Text`, `LongText`, `Number`, `Currency`, `Boolean`, `Id`, `Location`,
`ContactInfo`, `Avatar`, `Badge`, `BadgeGroup`, `Timestamp`, `Custom`. See
`types/dataTableCell.type.ts`.

## Prop mapping

| Old (`UITable`) | New (`UIDataTable`) | Notes |
| --- | --- | --- |
| `columns` | `columns` | Same slot in the API, completely different authoring — see above. |
| `data` | `data` | **Flat array only.** Grouping is now a prop, not a data shape. |
| `getKey` | `getKey` | Unchanged. |
| `isLoading` | `isLoading` | Unchanged. |
| `isFetchingNextPage` | `isFetchingNextPage` | Unchanged. |
| `isSelectable` | `isSelectable` | Unchanged. `@select` emit is unchanged too. |
| `error` | `error` | Unchanged, `#error` slot included. |
| `onNextPage` | `onNextPage` | Unchanged. |
| `sort` | `sort` | Unchanged — still `useSort`, still server-driven. |
| `isColumnResizeDisabled` | `isColumnResizeDisabled` | Unchanged. |
| `getLink` | `row(item).onClick` | See "Row interaction" below — links become handlers. |
| `onRowClick` | `row(item).onClick` | Merged with `getLink` into one resolver. |
| `getActionModel` | `row(item).model` | |
| `actions` | `row(item).actions.inline` / `.more` | Now per-row, not table-wide. |
| `actionGroup` | `selectionActions` | The old prop was documented but never implemented. |
| `groupHeaderCells` | — | No equivalent. See "No equivalent" below. |
| `hasActiveSearch` | — | No filter-aware empty state; see below. |
| `activeFilterCount` | — | Same. |
| `@clearFilters` / `@clearSearch` | — | Same. |
| `headerActions` | — | Render your own toolbar above `DataTable`. |
| `variant` | — | No `contained` / `full-page` variants. |
| `isCenteredHeaderContent` (column) | — | No per-column header alignment. |
| `headerDescription` (column) | — | No header tooltip/description. |
| `actionConfig` (column) | — | No per-column header actions. |
| `size: { min, max }` (column) | `size: number` | Pixels, not a CSS min/max pair — see "Sizing". |
| — | `groupBy` | New. |
| — | `mobileCard` | New — see "Mobile". |
| — | `subComponent` | New — row expansion. |
| — | `isFirstColumnSticky` (default `true`) | New, and **on by default**. |
| — | `isLastColumnSticky` | New. |
| — | `isSticky: 'left' \| 'right'` (column) | New — pin any column by key. |
| — | `totalCount` | New — stable select-all count across pages. |

## Grouping: data shape → prop

The old table inferred its mode by sniffing the first element of `data` for `items` /
`subGroups`, and you built the grouped structure yourself.

```ts
// Before — you group the data
const data: TableGroupedData<User>[] = [
  { key: 'eng', label: 'Engineering', items: engineeringUsers, isOpenByDefault: true },
  { key: 'sales', label: 'Sales', items: salesUsers },
]
```

```ts
// After — flat data in, one prop
<UIDataTable :data="users" group-by="department" />
```

- Group labels are derived from the grouped column's own Cell definition — there is no `label` to
  author, and no `key`.
- Two levels max, same as before: pass a tuple — `:group-by="['department', 'status']"` (a
  binding, not a plain attribute).
- Groups default to expanded (the old `isOpenByDefault: true` default). **There is no way to
  default a group closed.**
- Requires a real column whose `key` matches — you group by a column, not by an arbitrary field.

## Row interaction: `getLink` and `onRowClick` → `row`

Everything about a row — click target, action-registry model, actions — is now resolved once,
from the same item, by one function.

```ts
// Before — three separate top-level props
<UITable
  :get-link="(item) => ({ name: 'user-detail', params: { id: item.id } })"
  :get-action-model="(item) => ({ key: item.id, modelName: 'user' })"
  :actions="userActions"
/>
```

```ts
// After — one resolver
<UIDataTable :row="row" />

function row(item: User): DataTableRowConfig | null {
  return {
    onClick: createDataTableRowLinkClick({ name: 'user-detail', params: { id: item.id } }),
    model: { key: item.id, modelName: 'user' },
    actions: { inline: [viewAction(item)], more: [deleteAction(item)] },
  }
}
```

`onClick` is a typed `link | action` union (`DataTableRowClick`), built via
`createDataTableRowLinkClick(to)`/`createDataTableRowActionClick(action)` — never construct it by
hand. `createDataTableRowLinkClick` restores `getLink`'s real `<a>`/`RouterLink` rendering: rows
support middle-click, cmd-click and "open in new tab" again, the same as the old `Table`. Use
`createDataTableRowActionClick` instead when the click should run through the Action registry
(`isApplicable`/`disabledReason`/execution state), the same resolution `actions.inline`/`.more`
already get — not for plain non-navigational side effects, which don't need either variant (a row
with no `onClick` at all just has no click target).

One real behavior change to be aware of: **`UITableCellInteractiveElement` is gone and
unnecessary.** The old row-wide `<a>` overlay meant interactive cell content had to be wrapped to
stop click-through. `DataTable` puts a click-catcher *underneath* each cell's content instead, so
buttons and links inside a cell already take priority. Drop the wrapper.

Actions move from table-wide to per-row: `actions.inline` render as always-visible icon buttons
in a trailing column, `actions.more` sit behind its `⋯` menu **and** become the row's right-click
context menu. Reserve the trailing column's width by setting `row` at all — it stays reserved even
for rows whose `row(item)` resolves no actions, so column edges stay aligned.

## Sizing

The old sizing was a CSS min/max pair per column (`{ min: 'min-content', max: '20rem' }`),
defaulting to fluid `fit-content()` behavior. That caused a real bug: with virtualization, only
mounted rows feed `fit-content()`, so scrolling visibly resized columns and then resized them back.

New rules:

- Every column has a **fixed pixel width from first render**, defaulted per cell *type*.
- Override with `size: number` (pixels). A `{ min, max }` object is not a valid value.
- The **last column always fills** remaining space.
- Drag-resize is session-only, same as before — still not persisted across reloads.

## Sticky columns

`isFirstColumnSticky` **defaults to `true`**. If you migrate a table that had no frozen column and
don't want one, pass `:is-first-column-sticky="false"` explicitly.

Any column can pin via `isSticky: 'left' | 'right'` on its factory call. Columns pinned to the same
side form one contiguous region with cumulative offsets — including the checkbox/expand leading
columns, which join the sticky-left region automatically.

## Mobile

The old table had no mobile mode — it scrolled horizontally on small screens. `DataTable` swaps to
a card list below a container-query breakpoint (its own width, not the viewport).

Configure the collapsed card with up to four column keys:

```ts
<UIDataTable :mobile-card="{ primary: 'name', secondary: 'department', meta: 'lastActiveAt', indicator: 'status' }" />
```

Every column *not* named there renders in the expanded card. Two things to plan for:

- **`mobileCard` is optional but you want it.** Without it the collapsed card has no curated
  primary label.
- **The mobile list virtualizes into its own bounded scroll container.** If your page relied on
  page-level scrolling for a long list, `DataTable` needs an explicit height for this to engage.

## No equivalent — decide before you migrate

These have no replacement. None is a blocker on its own, but check your table doesn't depend on one:

- **`groupHeaderCells`** — per-group summary cells aligned to columns (e.g. group totals). Group
  header rows now render a label only. This is the most likely hard blocker.
- **Filter-aware empty state** — `hasActiveSearch` / `activeFilterCount` / `@clearFilters` /
  `@clearSearch` gave a "no results, clear filters" empty state. `DataTable` has one generic empty
  state and no filter prop surface. Its empty state has no slot override either.
- **`headerActions` / `actionGroup` toolbar** — `TableRoot` rendered a toolbar. Render your own
  above `DataTable`; use `selectionActions` for the selection bar.
- **`variant: 'contained' | 'full-page'`** — `DataTable` has one look.
- **Column header extras** — `headerDescription`, `isCenteredHeaderContent`, `actionConfig`.
- **Detail pane** — designed, not implemented. Don't migrate *expecting* it.

## Suggested order

1. Confirm nothing in "No equivalent" blocks you — especially `groupHeaderCells` and the
   filter-aware empty state.
2. Convert columns to factories. Start with `Text`/`Number`/`Timestamp`; reach for `Custom` via
   `createCustomCell` only where no built-in fits.
3. Flatten `data` and replace grouped shapes with `groupBy`.
4. Collapse `getLink` / `onRowClick` / `getActionModel` / `actions` into one `row` resolver, and
   delete `UITableCellInteractiveElement` wrappers.
5. Replace `size: { min, max }` with pixel `size`.
6. Decide `isFirstColumnSticky` explicitly — it's `true` by default.
7. Add `mobileCard`, and give the table a height if the page scrolled the list before.
8. Check open-in-new-tab: if the table used `getLink`, that capability is gone.

## Reference

- `DATA_TABLE.md` — decisions-only reference for the new component.
- `CONTEXT.md` (package root) — full reasoning, rejected alternatives, bugs found.
- `types/dataTable.props.ts` — every public prop, documented.
- `types/dataTableColumn.type.ts` — the column factories.
- `types/dataTableCell.type.ts` — Cell definition shapes.
