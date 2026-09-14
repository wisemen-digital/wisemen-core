# DataTable

TanStack Table-based rework of the table system. Lives alongside the old `Table`/`TableRoot`
(`ui/table/`), does not replace it — existing consumers migrate over time.

Full historical reasoning (bugs found, alternatives rejected, why) lives in `CONTEXT.md`. This
file is the condensed, decisions-only reference. Porting an existing `Table` over?
`MIGRATING_FROM_TABLE.md` covers the prop-by-prop delta and what has no equivalent.

## Core concepts

- **Cell definition** — presentation-agnostic description of how one field renders. Same
  definition is reused in the table body, the detail pane, and the mobile list. Types: `Text`,
  `LongText`, `Number`, `Currency`, `Boolean`, `Id`, `Location`, `ContactInfo`, `Avatar`, `Badge`,
  `BadgeGroup`, `Timestamp`, `Custom` (via `createCustomCell`).
- **Column** — table-only wrapper around a Cell definition: header label, key, size, sort key.
  The Cell definition itself knows nothing about headers/sizing/sorting.
- **Column factories** — `createDataTableTextCell`, `createDataTableLongTextCell`,
  `createDataTableNumberCell`, `createDataTableCurrencyCell`, `createDataTableBooleanCell`,
  `createDataTableIdCell`, `createDataTableLocationCell`, `createDataTableContactInfoCell`,
  `createDataTableAvatarCell`, `createDataTableBadgeCell`, `createDataTableBadgeGroupCell`,
  `createDataTableTimestampCell`, `createDataTableCustomCell`. This
  is the *only* supported way to author a column — never hand-assemble `cell`/`cellType` yourself,
  the factory keeps them in sync structurally.
- **`variant`** — `'contained'` (default) wraps the desktop table in a rounded bordered card,
  matching the old `Table`'s default look, and sizes the table to its content up to its parent's
  height (`max-h-full`) — a short result set shrinks the table instead of stretching it to fill
  the parent, matching the old `Table`'s `TableScrollContainer.vue` behavior. `'full-page'` drops
  the border/rounding for an edge-to-edge table and always stretches to fill its parent
  (`size-full`/`flex-1`), e.g. when a page's own layout already provides the frame and the table
  should occupy the remaining viewport regardless of row count. Row height and row borders are
  unaffected by either variant.

## Column sizing

- Every column gets a **fixed pixel width from first render** — no fluid/`fit-content()` sizing,
  ever. Default width comes from a flat lookup table keyed by cell **type** only (not by that
  cell's specific config).
- Override the default via `size` on a column — a plain `number` (pixels).
- The **last column always fills remaining space** (`minmax(0, auto)` in the grid template) — the
  one deliberate exception to "every column is fixed." Keeps the table from leaving dead
  whitespace.
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
- Grid tracks, header cells, and body cells all render in actual **visual** column order
  (start-pinned, then center, then end-pinned) — never TanStack's own declared/"flat" order,
  which never reorders for pinning. Resizing a pinned column's track (built from this visual
  order) always matches where it visually renders; see "Sticky columns" below for why this
  matters specifically during resize.

## Sticky columns

- `isFirstColumnSticky` defaults to **`true`** — the first column stays pinned while
  horizontally scrolling unless explicitly disabled. `isLastColumnSticky` still defaults to
  `false`.
- Any column can pin by key via `isSticky: 'left' | 'right'` on its column definition (passed
  to any `createDataTableXCell` factory), independent of `isFirstColumnSticky`/
  `isLastColumnSticky`. Multiple columns pinned to the same side stick together as one
  contiguous region, not independently — real TanStack column pinning
  (`table.getStartLeafColumns()`/`getEndLeafColumns()`), not a CSS trick limited to one column
  per side.
- The CSS grid template, header cells, and body cells are all built from the same visual
  column order (start-pinned → center → end-pinned), not TanStack's declared order — a pinned
  column's grid track always lines up with where it actually renders. Without this, resizing a
  pinned column visibly opened a gap at its un-pinned, declared position, since that stale
  track's width would change while nothing was visually anchored there anymore.
- When `isSelectable`/a `subComponent` is configured, the checkbox/expand leading columns
  (which aren't real TanStack columns) join the sticky-left region automatically whenever
  anything is pinned left — they scroll and stick together with the first data column, not
  independently of it.
- The checkbox column is **always sticky-left** whenever `isSelectable` is on — unconditionally,
  even if `isFirstColumnSticky` is `false` and no column is pinned via `isSticky: 'left'`.
  Selection should never be able to scroll out of view. When the checkbox ends up as the *only*
  thing in the sticky-left region (nothing else pinned), it draws its own trailing border so it
  still has a visible divider from the scrolling content next to it.
- Only the outer edge of a multi-column sticky region gets a border (the rightmost column of a
  sticky-left group, the leftmost of a sticky-right group) — not between every pinned column.
- A sticky region's edge border only shows once the table is actually scrolled away from that
  edge — a table with pinned columns that never needs to scroll (nothing overflows) shows no
  border at rest. Mirrors the old `Table`'s `isScrolledFromLeft`, mirrored for the right edge too
  and applied everywhere a sticky/fixed edge draws a divider: real pinned columns, the checkbox's
  own border, and the trailing actions column's border.

## Rows & selection

- **Row selection**: state lives in `@wisemen/vue-core-actions`'s action manager store
  (`useActionManagerStore().tableSelection`), shaped as `{ type: 'include' | 'exclude', items: string[] }`
  (item keys, not full rows) — there is no `select` emit. `isSelectable` prop turns on the checkbox
  column (desktop: always visible when enabled; mobile: hidden behind an explicit toggle, see
  Mobile list below).
- **Selection action bar**: `selectionActions: Action[]`, filtered through `resolveApplicable`.
  Floating bar shown once ≥1 row is selected. Built from scratch (the old `Table`'s equivalent
  prop was documented but never actually implemented).
- **Sub component** (row expansion): `subComponent?: (item: TItem) => Component | null`. Return
  `null` for a row → no expand chevron for that row at all. No separate "can expand" predicate —
  the null return already says it. Independent from grouping (see below); a grouped row can still
  have its own sub component.

## Row actions & click

- **`row`**: `(item: TItem) => { onClick?: DataTableRowClick | null, model: RegisteredActionContext['models'][number], actions: { inline: Action[], more: Action[] } } | null`.
  One function replaces the old `getLink`/`getActionModel` top-level props — everything about a
  row's click/navigation and actions is resolved once, from the same item, in one place. Return
  `null` for a row with no click target/actions at all.
- **`onClick`**: a typed `{ type: 'link', to } | { type: 'action', action }` union — built via
  `createDataTableRowLinkClick(to)`/`createDataTableRowActionClick(action)`, never by hand. The
  `link` variant renders a real `RouterLink`/anchor (native cmd/middle-click, right-click-copy-link
  all work); the `action` variant wraps a genuine `Action`, resolved through the same registry
  (`isApplicable`/`disabledReason`/execution state) as `actions.inline`/`.more`. Drives the desktop
  whole-row click target (a per-cell click-catcher underneath every cell's content, so real
  interactive content inside a cell still takes priority — see `DataTableCell.vue`) and the mobile
  card's "Go to detail" button (expanded-card only).
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
  resize/reorder/visibility. Its width is only reserved when at least one row's own
  `row(item).actions` actually resolves to inline/more actions — a consumer using `row` solely for
  `onClick`/`model`, with no row ever carrying actions, sees no reserved, empty column.
- **Row fade when a menu is open**: opening any row's `⋯` overflow menu or right-click context
  menu dims every other row (`opacity-25`), keeping visual focus on the row being acted on; that
  row itself stays at full opacity. Pure CSS (`:has()` selectors keyed off the menu trigger's own
  `data-state`), no JS state — ported verbatim from the old `Table`.

## Data lifecycle (loading, error, empty, infinite scroll)

- **`isLoading`**: true while the initial fetch is in flight and `data` is still empty. Renders a
  10-row skeleton in place of the rows (same visual as the old `Table`'s `TableLoading`).
- **`isFetchingNextPage`**: true while a next-page fetch is in flight and rows already exist.
  Renders the same skeleton, appended below the already-loaded rows instead of replacing them.
- **`error`**: `ApiError | null`. When set, replaces the row/body area with `UIErrorState` — the
  header row and its columns stay visible above it (desktop only; on mobile, which has no header
  row, the state replaces the whole list). Takes priority over the empty state. Not customizable
  beyond that — `UIErrorState` derives its own title/description from the error's shape (API error
  status/detail, Zod validation error, or a generic fallback), so error display stays consistent
  everywhere a DataTable is used rather than becoming a per-table copy decision.
- **Empty state**: shown when `data.length === 0 && !isLoading && error === null` — default
  `UIEmptyState` with generic "No data" text, overridable per-table via the `emptyState` prop
  (`{ title?, description?, icon?, illustration?, primaryAction?, secondaryAction? }`, all
  optional — unset fields keep their default). Same header-stays-visible treatment as the error
  state on desktop.
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
- The group header's checkbox + label/chevron stick to the scroll container's left edge together
  (`sticky left-0`) whenever `isSelectable` is on — unconditional, not tied to any column being
  pinned. The header is one continuous banner (not per-column cells like a data row), so it sticks
  as a whole rather than only its checkbox.
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

- **Status: paused after design work — Phase 4 not implemented yet.** None of the below exists in
  code yet, including the "active row" pointer itself — this section is design intent only.
- Side panel showing every Cell definition for one row (including columns hidden from the table),
  auto-generated from the row's own Column set. Closed via Escape or a close button.
- **Active row**: one shared "current row" pointer (distinct from DOM focus), set by hovering.
  Moving the mouse off the table entirely does not clear it.
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
- `isRelative` renders a hover tooltip with the full absolute date/time — the relative text stays
  scannable while the exact value is always one hover away.
- **Choosing granularity**: default to the coarsest granularity the use case actually needs, not
  the finest one available. A "last active" or "created" column rarely needs seconds — `minute`
  or `hour` reads cleaner and is usually enough context. Many date columns don't need a time
  component at all (`day`/`month`/`year`); a column showing e.g. subscription renewals across
  several years is often clearest at `month` or even `year` alone. Reach for `isRelative` when the
  recency itself is the point ("last active 3 hours ago"); reach for a fixed `granularity` when the
  precise date matters more than how long ago it was.

## ContactInfo cell

- Icon-only row (phone/email/website), one icon per channel present in `value`. Opens a popover
  (touch devices) or a hoverable tooltip (non-touch) listing that channel's value(s), each with a
  copy button and a `tel:`/`mailto:` link (website has no "open" action of its own beyond the
  copy). See `DataTableCellHoverPopover.vue` below.
- Copy/call/mailto are plain local browser behavior (`useClipboard`, `tel:`/`mailto:` links) — no
  Action registry involvement.

## Location cell

- The always-visible cell text is still `precision`-limited (`country` | `municipality` |
  `streetAndNumber`), unchanged. Opens a popover/tooltip (see `DataTableCellHoverPopover.vue`
  below) with the **full** formatted address (every `Address` field, not just the
  `precision`-limited slice) plus an "Open in Google Maps" link built from `value.coordinates`.
- No embedded map image — `AddressAutocompleteAdapter` has no map-rendering capability today; out
  of scope until that adapter contract is extended separately.

## Device-adaptive popover — `DataTableCellHoverPopover.vue`

- Shared by the ContactInfo and Location cells (both need the same "extra detail on demand"
  interaction). Same `#trigger`/`#content` slot content renders in a hover-triggered `Tooltip` on
  non-touch devices, or a tap-triggered `Popover` on touch devices — detected via
  `useIsTouchDevice` (`composables/useIsTouchDevice.composable.ts`,
  `(hover: none) and (pointer: coarse)`).
- Needed because both cells render identically inside mobile cards via the same
  `DataTableCellRenderer` — there's no separate "desktop-only" surface to hardcode hover on, and
  touch devices have no hover at all.
- The `Tooltip` variant sets `isHoverableContentDisabled: false` so the pointer can move from the
  trigger into the content to click the copy/call/maps-link buttons without it closing first.

## Boolean cell

- `value: boolean | null` renders a check/x icon (green/red); `null` renders the shared empty-value
  fallback (see "Empty values" below).
- `label` is **required** — rendered as visually-hidden text next to the icon, since color/icon
  alone isn't accessible.

## Empty values

- Every Cell definition whose core value can be `null` (`Text`, `Number`, `Currency`, `LongText`,
  `Timestamp`, `Id`, `Location`, `Boolean`, `Badge`, `Avatar`) accepts an optional
  `fallback?: string`, rendered via the shared `DataTableCellEmptyValue.vue` (a muted, `text-tertiary`
  dash — `DATA_TABLE_CELL_EMPTY_VALUE_FALLBACK` in `utils/dataTable.util.ts`) whenever the value is
  `null`/empty and no `fallback` was given. This exists so a missing value always reads as
  "confirmed empty," not as a layout bug or a stuck loading state — an unstyled blank cell (or, for
  `Badge`, an empty rounded pill with no label) looks broken.
- `ContactInfo` and `BadgeGroup` are the exception: an empty list of contact channels/badges is a
  legitimately different state from a missing single value (there's no one "the value" to be
  null), so they render nothing rather than a dash.

## Currency cell

- `{ value, currency, fallback? }` — `currency` is an ISO 4217 code (e.g. `'EUR'`). Kept as its
  own cell type rather than a `Number` formatting preset, for the same "clearer intent" reasoning
  that keeps `Timestamp` distinct from `Text`.

## LongText cell

- Same truncate-with-ellipsis visual as `Text`, always wrapped in a tooltip revealing the full
  value on hover (no truncation-detection — matches `Timestamp`'s relative-time tooltip
  precedent). No expand-in-place, no multi-line reveal.

## BadgeGroup cell

- `{ badges: DataTableBadgeCell[], maxVisible? }` (default `maxVisible: 3`) — renders several
  badges inline, truncating to `maxVisible` with a plain gray `+N` overflow badge for the rest.

## Avatar cell

- Renamed/generalized from `Person` — `{ label, avatarUrl?, supportingText? }`. `label` (not
  `name`) so the same cell can represent a team, company, or vehicle, not only a person.

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
