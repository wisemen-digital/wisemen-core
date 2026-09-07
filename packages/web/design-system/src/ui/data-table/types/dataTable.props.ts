import type { Action } from '@wisemen/vue-core-actions'
import type { ApiError } from '@wisemen/vue-core-api-utils'
import type { Component } from 'vue'

import type { Sort } from '@/composables/sort.composable'
import type { DataTableGroupBy } from '@/ui/data-table/composables/dataTable.composable'
import type { DataTableColumn } from '@/ui/data-table/types/dataTableColumn.type'
import type { DataTableRowConfig } from '@/ui/data-table/types/dataTableRowConfig.type'
import type {
  EmptyStateAction,
  EmptyStateIllustration,
} from '@/ui/empty-state/emptyState.props'

export interface DataTableMobileCardConfig {
  indicator?: string
  primary: string
  secondary?: string
  meta?: string
}

export interface DataTableEmptyStateConfig {
  /**
   * @default component.data_table.empty_state.no_data.title
   */
  title?: string
  /**
   * @default component.data_table.empty_state.no_data.description
   */
  description?: string | null
  /**
   * Ignored when `illustration` is set.
   * @default null
   */
  icon?: Component | null
  /**
   * Takes priority over `icon` when both are set.
   * @default 'cloud-search'
   */
  illustration?: EmptyStateIllustration | null
  primaryAction?: EmptyStateAction | null
  secondaryAction?: EmptyStateAction | null
}

export interface DataTableProps<TItem> {
  /**
   * Whether the column resize handles are hidden and users cannot drag to resize columns.
   */
  isColumnResizeDisabled?: boolean
  /**
   * Whether a next-page fetch (triggered via `onNextPage`) is in flight. Renders a trailing
   * skeleton below the already-loaded rows, unlike `isLoading` which has no rows to show yet.
   */
  isFetchingNextPage?: boolean
  /**
   * Makes the first column sticky (fixed) when horizontally scrolling. Defaults to `true` —
   * pass `false` to opt out. Columns pinned individually via `DataTableColumn.isSticky: 'left'`
   * stick together with the first column as one contiguous region, not independently of it.
   */
  isFirstColumnSticky?: boolean
  /**
   * Makes the last column sticky (fixed) when horizontally scrolling.
   */
  isLastColumnSticky?: boolean
  /**
   * Whether the initial data fetch is in flight and `data` is not yet populated. Renders a
   * skeleton in place of the rows.
   */
  isLoading?: boolean
  /**
   * When `true`, a checkbox column is prepended to the table, enabling row selection. There is
   * no emit for the selection state — read it via `ctx.tableSelection` (`{ type: 'include' |
   * 'exclude', items: string[] }`) inside a `selectionActions` action's `execute`/`isApplicable`.
   */
  isSelectable?: boolean
  /**
   * Column definitions describing each column's header label, unique key, cell renderer,
   * and optional size constraints.
   */
  columns: DataTableColumn<TItem>[]
  /**
   * The flat row data to render.
   */
  data: TItem[]
  /**
   * Overrides the empty state (`data.length === 0 && !isLoading && error === null`) shown in
   * place of `UIEmptyState`'s default generic text/illustration. Any field left unset keeps its
   * default.
   */
  emptyState?: DataTableEmptyStateConfig
  /**
   * The current fetch error, if any. Replaces the row area with `UIErrorState`, which derives
   * its own title/description from the error's shape (API error status/detail, Zod validation
   * error, or a generic fallback) — not independently overridable, so error display stays
   * consistent everywhere a DataTable is used.
   */
  error?: ApiError | null
  /**
   * Returns a stable, unique key for a row item. Used to track rows across re-renders.
   */
  getKey: (item: TItem) => string
  /**
   * Groups rows by this column's value, rendering a collapsible group header row above each
   * distinct value. Pass a two-element tuple to additionally sub-group within each group by a
   * second column — there is no third level. Groups default to expanded. Grouped rows and
   * headers are virtualized, same as the flat, ungrouped list.
   */
  groupBy?: DataTableGroupBy
  /**
   * Composes the mobile list's collapsed card from up to 4 column keys: `primary` (required,
   * the card's main label) plus optional `secondary`/`meta`/`indicator`. Any column not
   * referenced here renders in the expanded card instead — there is no per-column mobile
   * config, so two fields can never accidentally claim the same slot.
   */
  mobileCard?: DataTableMobileCardConfig | null
  /**
   * Per-row click/navigation and actions, resolved from the row's own item. `onClick` drives
   * the whole-row click target (desktop) and the mobile card's "Go to detail" button; `model`
   * feeds the Action registry's applicability checks (also used for the selection action bar);
   * `actions.inline` render as always-visible icon buttons in the trailing actions column,
   * `actions.more` sit behind its `⋯` overflow menu and the row's right-click context menu.
   * Return `null` for a row with no click target/actions at all.
   */
  row?: ((item: TItem) => DataTableRowConfig | null) | null
  /**
   * Actions shown in a floating bar once one or more rows are selected. Only actions that
   * resolve as applicable for the current selection are rendered.
   */
  selectionActions?: Action[]
  /**
   * Sort state returned by `useSort`. When provided, column headers with a matching sort key
   * become clickable and display an ascending/descending indicator. Sorting is server-driven —
   * DataTable does not sort rows itself, it only reflects and toggles this state.
   */
  sort?: Sort<any> | null
  /**
   * Renders arbitrary extra content beneath a row when the row is expanded, independent of
   * grouping — this is not shared expansion state with sibling rows or group headers. Return
   * `null` for a given row to indicate it has no expand chevron at all.
   */
  subComponent?: ((item: TItem) => Component | null) | null
  /**
   * The total row count matching the current filter, if known server-side. Used only to
   * display a correct, stable count in the selection action bar during select-all — without
   * it, select-all shows the number of rows currently loaded, which climbs as more pages
   * fetch in via `onNextPage`.
   */
  totalCount?: number | null
  /**
   * `'contained'` (default) wraps the table in a rounded card with its own border, matching the
   * old `Table`'s default look, and sizes the table to its content up to its parent's height —
   * a short result set shrinks the table instead of stretching it to fill the parent.
   * `'full-page'` drops the border/rounding for an edge-to-edge table and always stretches to
   * fill its parent, e.g. when a page's own layout already provides the frame. Row height,
   * borders between rows, and empty/error state content are unaffected by either variant.
   */
  variant?: 'contained' | 'full-page'
  /**
   * Called when the user scrolls near the end of the loaded rows, or when the loaded rows
   * don't fill the scroll container at all — the signal to fetch the next page. Pass `null`
   * (default) when there is no next page, e.g. all data is already loaded client-side.
   */
  onNextPage?: (() => void) | null
}
