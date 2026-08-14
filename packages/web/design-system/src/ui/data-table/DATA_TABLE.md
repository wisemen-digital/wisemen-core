# DataTable

TanStack Table-based rework of the table system. Lives alongside the old `Table`/`TableRoot`
(`ui/table/`), does not replace it — existing consumers migrate over time.

Full historical reasoning (bugs found, alternatives rejected, why) lives in `CONTEXT.md`. This
file is the condensed, decisions-only reference. Porting an existing `Table` over?
`MIGRATING_FROM_TABLE.md` covers the prop-by-prop delta and what has no equivalent.

## Core concepts

- **Cell definition** — presentation-agnostic description of how one field renders. Same
  definition is reused in the table body, the detail pane, and the mobile list. Types: `Text`,
  `Number`, `Id`, `Location`, `ContactInfo`, `Person`, `Badge`, `Timestamp`, `Custom` (via
  `createCustomCell`).
- **Column** — table-only wrapper around a Cell definition: header label, key, size, sort key.
  The Cell definition itself knows nothing about headers/sizing/sorting.
- **Column factories** — `createDataTableTextCell`, `createDataTableNumberCell`,
  `createDataTableIdCell`, `createDataTableLocationCell`, `createDataTableContactInfoCell`,
  `createDataTablePersonCell`, `createDataTableBadgeCell`, `createDataTableTimestampCell`,
  `createDataTableCustomCell`. This
  is the *only* supported way to author a column — never hand-assemble `cell`/`cellType` yourself,
  the factory keeps them in sync structurally.

## Column sizing

- Every column gets a **fixed pixel width from first render** — no fluid/`fit-content()` sizing,
  ever. Default width comes from a flat lookup table keyed by cell **type** only (not by that
  cell's specific config).
- Override the default via `size` on a column — a plain `number` (pixels).
- The **last column always fills remaining space** (`FILL_SPACE_COLUMN`) — the one deliberate
  exception to "every column is fixed." Keeps the table from leaving dead whitespace.
- Manual drag-resize works on top of whichever width (default or overridden) a column starts at.
- Minimum resize width = `max(DATA_TABLE_MIN_COLUMN_WIDTH_PX constant, that column's measured label width)`.
  A column can never be dragged small enough to clip its own header label.
- Resize state is **session-only** (in-memory) — no persistence, resets on reload.

## Column resize

- TanStack provides drag logic only (delta tracking, clamping, mousemove/mouseup) — DataTable
  builds its own grip handle, matching the old `Table`'s handle for visual continuity.
- `columnResizeMode: 'onChange'` — column grows/shrinks live while dragging (not on drop).
- Double-click-to-fit-content is hand-rolled (measure at `max-content`, feed width back in) —
  TanStack has no equivalent.
- Resize handle is centered on the column boundary (half in each column), with `z-index`
  elevation scoped to *this cell's own handle* being hovered or actively dragged — hovering a
  neighboring cell does nothing.
- Resizing never grows the table past its container — it only redistributes space between the
  dragged column and the fill column.
- `isColumnResizeDisabled` prop hides the handles and disables dragging entirely.

## Sticky columns

- `isFirstColumnSticky` defaults to **`true`** — the first column stays pinned while
  horizontally scrolling unless explicitly disabled. `isLastColumnSticky` still defaults to
  `false`.
- Any column can pin by key via `isSticky: 'left' | 'right'` on its column definition (passed
  to any `createDataTableXCell` factory), independent of `isFirstColumnSticky`/
  `isLastColumnSticky`. Multiple columns pinned to the same side stick together as one
  contiguous region, not independently — real TanStack column pinning
  (`table.getLeftLeafColumns()`/`getRightLeafColumns()`), not a CSS trick limited to one column
  per side.
- When `isSelectable`/a `subComponent` is configured, the checkbox/expand leading columns
  (which aren't real TanStack columns) join the sticky-left region automatically whenever
  anything is pinned left — they scroll and stick together with the first data column, not
  independently of it.
- Only the outer edge of a multi-column sticky region gets a border (the rightmost column of a
  sticky-left group, the leftmost of a sticky-right group) — not between every pinned column.

## Rows & selection

- **Row selection**: reuses the existing `TableSelectionState<T>` shape verbatim —
  `{ type: 'includes' | 'excludes', items: T[] }`. `isSelectable` prop turns on the checkbox
  column (desktop: always visible when enabled; mobile: hidden behind an explicit toggle, see
  Mobile list below).
- **Selection action bar**: `selectionActions: Action[]`, filtered through `resolveApplicable`.
  Floating bar shown once ≥1 row is selected. Built from scratch (the old `Table`'s equivalent
  prop was documented but never actually implemented).
- **Active row**: one shared "current row" pointer (distinct from DOM focus). Hovering sets it;
  arrow up/down (only while the detail pane is open) moves it. Moving the mouse off the table
  entirely does not clear it.
- **Sub component** (row expansion): `subComponent?: (item: TItem) => Component | null`. Return
  `null` for a row → no expand chevron for that row at all. No separate "can expand" predicate —
  the null return already says it. Independent from grouping (see below); a grouped row can still
  have its own sub component.

## Row actions & click

- **`row`**: `(item: TItem) => { onClick?: () => void, model: RegisteredActionContext['models'][number], actions: { inline: Action[], more: Action[] } } | null`.
  One function replaces the old `getLink`/`getActionModel` top-level props — everything about a
  row's click/navigation and actions is resolved once, from the same item, in one place. Return
  `null` for a row with no click target/actions at all.
- **`onClick`**: drives the desktop whole-row click target (a per-cell click-catcher underneath
  every cell's content, so real interactive content inside a cell still takes priority — see
  `DataTableCell.vue`) and the mobile card's "Go to detail" button (expanded-card only, unchanged
  visually from the old `getLink`-driven version).
- **`actions.inline`**: always-visible icon buttons in a trailing actions column. Rendered via
  `UIActionTrigger`, so `isApplicable`/`disabledReason`/execution state are the same as any other
  registry-driven action, not hand-rolled.
- **`actions.more`**: behind a `⋯` overflow dropdown in the same trailing column, and doubles as
  the row's right-click context menu content (`UIActionContextMenu` wraps the row, fed
  `actions.inline` + `actions.more` combined).
- **`model`**: the Action registry context (`RegisteredActionContext['models'][number]`) actions
  resolve applicability against — also feeds the selection action bar (replaces the old
  `getActionModel` prop).
- **Trailing actions column**: a hand-appended, non-TanStack grid track (mirrors the leading
  checkbox/expand columns) — not a real pinned TanStack column, so it never participates in
  resize/reorder/visibility. Its width is always reserved once `row` is set at all, even for a
  specific row whose own `row(item)` resolves to no actions, so column edges stay aligned.

## Data lifecycle (loading, error, empty, infinite scroll)

- **`isLoading`**: true while the initial fetch is in flight and `data` is still empty. Renders a
  10-row skeleton in place of the rows (same visual as the old `Table`'s `TableLoading`).
- **`isFetchingNextPage`**: true while a next-page fetch is in flight and rows already exist.
  Renders the same skeleton, appended below the already-loaded rows instead of replacing them.
- **`error`**: `ApiError | null`. When set, replaces the entire row area with the `#error` slot
  (scoped prop `{ error }`) or, by default, `UIErrorState`. Takes priority over the empty state.
- **Empty state**: shown when `data.length === 0 && !isLoading && error === null` — default
  `UIEmptyState`, no slot override yet (DataTable has no filter/search prop surface to key a
  "no results" variant off of, unlike the old `Table`).
- **`onNextPage`**: called when the active scroll container (desktop flat, desktop grouped, or
  mobile — whichever is actually mounted) nears its bottom, or immediately if the loaded rows
  don't fill/overflow the container at all. `null`/omitted disables the trigger entirely — for
  tables that load all their data client-side up front. One shared composable
  (`useDataTableInfiniteScroll`) is called once per real scroll container (`DataTable.vue` for
  desktop, `DataTableMobileList.vue` for mobile) — not per virtualizer, since the desktop flat and
  grouped virtualizers both run against the same DOM element and only one is ever rendered.
- **`totalCount`**: optional server-reported count matching the current filter. Only affects the
  selection action bar's displayed number during select-all — without it, select-all shows
  `data.length`, which climbs as more pages load in via `onNextPage` with no indication it was
  never a stable total. Growing selection itself (newly-loaded rows automatically joining an
  active select-all) is unchanged — this only fixes what number is displayed.

## Grouping

- API: `groupBy?: string | [string, string] | null` — flat `data` in, DataTable groups
  automatically. No pre-grouped data shape to construct (unlike the old `Table`'s
  `TableGroupedData<T>[]`).
- Max **two levels** (group + sub-group) — matches the old table's split, no deeper nesting.
- Group header label is derived from the grouped column's own Cell definition rendering — no
  separate label string to author.
- `groupedColumnMode: false` — grouped column is *not* reordered to the front (TanStack's
  default). DataTable renders its own group-header row instead.
- Grouping and sub-component expansion are two independent mechanisms — see "Grouping vs. Sub
  component" in `CONTEXT.md` for the full state-implementation split.
- Row drag & drop is **benched** — no real use case yet, and conceptually conflicts with `sort`
  (server-driven order) as two competing owners of row order. If ever needed: a *separate*
  component (`DataTableOrderable`), not a mode on `DataTable`.

## Virtualization

- The flat list, grouped list, and mobile card list are all virtualized (three separate
  composables — group headers/data rows/mobile cards all have different, and in the mobile
  card's case *changing* (collapse/expand), heights, so both grouped and mobile use dynamic
  measurement instead of one fixed row height).
- Mobile list virtualization gives `DataTableMobileList` its own bounded, scrollable container
  (it previously grew with page content) — a consumer relying on page-level scroll for the mobile
  list needs to give `DataTable` an explicit height for this to engage.

## Mobile list

- Below a breakpoint, rows render as two-line/two-column cards instead of a grid row — driven by
  a **container query on DataTable's own width**, not viewport size and not a JS `isMobile` prop.
- 4 named slots for the collapsed card, configured via a single `mobileCard` prop (column keys),
  **not** per-column config:
  - `primary` (top-left, required — the row's main label)
  - `secondary` (bottom-left, supporting text)
  - `meta` (top-right, e.g. timestamp)
  - `indicator` (bottom-right, e.g. status dot/badge)
- Any column not referenced in `mobileCard` renders in the expanded card instead, as a bordered,
  divided list of label/value rows (not the `UIDetailListGroupItem` primitive — plain custom
  markup, since none of the detail-list components provide a bordered-card look on their own).
- Selection is **off by default on mobile** — must be turned on via an explicit toggle button,
  which then reveals a checkbox per card.
- Grouped mobile list mirrors desktop's group rows as collapsible section headers, same
  collapse/select-all-in-group behavior.
- **`subComponent` on mobile**: shares the same expand chevron/state as the unslotted-column
  reveal above — no second trigger. When `subComponent(item)` resolves to a component for a
  row, its content **replaces** the unslotted-column list entirely for that row, rather than
  showing alongside it — `subComponent` is a deliberate, curated view, not extra content to
  stack on top of the generic column dump. Rows with no `subComponent` still fall back to the
  unslotted-column list as before. The chevron appears whenever either has something to show.
- **Row actions on mobile**: when `row(item)` resolves inline/more actions, a "View details"
  button and a single `⋯` action-dropdown trigger (merging inline + more actions into one menu,
  unlike desktop's separate inline-icon-buttons-plus-overflow) render as the last row inside the
  same bordered card as the expanded fields — not as a separate floating row below it.

## Detail pane

- **Status: paused after design work — Phase 4 not implemented yet.**
- Side panel showing every Cell definition for one row (including columns hidden from the table),
  auto-generated from the row's own Column set. Closed via Escape or a close button.
- Opens only via **Spacebar**, acting on whatever the active row is at that moment.
- Once open: arrow up/down immediately move the active row *and* update the pane content. Hover
  moves the active-row indicator but does *not* update the pane until Spacebar is pressed again —
  deliberate asymmetry so idle mouse movement can never silently change what's shown.
- Cmd+O navigates to the row's real detail page via the active row's `row(item).onClick`.
- Desktop-only — the mobile list's tap-to-expand + "Go to detail" already covers the same need on
  touch.
- Built on top of the existing `DashboardPageDetailPane`, not a self-built panel — so it currently
  expects to render inside a `DashboardPage`. A tracked future refactor would extract a standalone
  primitive so DataTable doesn't need that ancestor.
- When grouped, arrow up/down skip group header rows — they land only on real data rows.

## Timestamp cell

- Discriminated union: `{ isRelative: true }` ("3 hours ago", live) **or**
  `{ granularity: 'second' | 'minute' | 'hour' | 'day' | 'month' | 'year' }` (absolute, truncated)
  — never both.

## What's explicitly out of scope (for now)

- Column resize/order persistence across reloads.
- Drag-to-reorder rows (see Grouping section — would be a separate component).
- Detail pane implementation (paused, design-only).
- A third grouping level.

## Where to look

- `types/dataTable.props.ts` — full public prop list.
- `types/dataTableColumn.type.ts` — column factories.
- `types/dataTableCell.type.ts` — Cell definition types.
- `types/dataTableRowConfig.type.ts` — the `row` prop's return shape.
- `utils/dataTable.util.ts` — sizing constants/helpers.
- `composables/dataTable.composable.ts` — grouping/table setup.
- `composables/dataTableInfiniteScroll.composable.ts` — shared scroll-near-bottom trigger.
- `components/DataTableRow.vue` — right-click context menu, trailing actions cell wiring.
- `components/DataTableRowActionsCell.vue` — inline/overflow action rendering.
- `CONTEXT.md` (package root) — full reasoning, rejected alternatives, bugs found along the way.
