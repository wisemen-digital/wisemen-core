import type { Action } from '@wisemen/vue-core-actions'
import type { ApiError } from '@wisemen/vue-core-api-utils'
import type { Component } from 'vue'

import type { Sort } from '@/composables/sort.composable'
import type {
  RegisteredActionContext,
  RegisteredRouteLocationRaw,
} from '@/register'
import type { DataTableGroupBy } from '@/ui/data-table/composables/dataTable.composable'
import type { DataTableColumn } from '@/ui/data-table/types/dataTableColumn.type'

export interface DataTableMobileCardConfig {
  indicator?: string
  primary: string
  secondary?: string
  meta?: string
}

export interface DataTableProps<TItem> {
  /**
   * Whether the column resize handles are hidden and users cannot drag to resize columns.
   */
  isColumnResizeDisabled?: boolean
  /**
   * Makes the first column sticky (fixed) when horizontally scrolling. Defaults to `true` —
   * pass `false` to opt out. Columns pinned individually via `DataTableColumn.isSticky: 'left'`
   * stick together with the first column as one contiguous region, not independently of it.
   */
  isFirstColumnSticky?: boolean
  /**
   * Whether a next-page fetch (triggered via `onNextPage`) is in flight. Renders a trailing
   * skeleton below the already-loaded rows, unlike `isLoading` which has no rows to show yet.
   */
  isFetchingNextPage?: boolean
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
   * When `true`, a checkbox column is prepended to the table, enabling row selection. Listen
   * to the `select` emit to receive the current selection state as either an `includes` array
   * (individual selections) or an `excludes` array (after select-all).
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
   * The current fetch error, if any. Replaces the row area with the `#error` slot (or the
   * default `UIErrorState`) until cleared.
   */
  error?: ApiError | null
  /**
   * Maps a row item to the action context model used by the actions system, for the
   * selection action bar. Required when `selectionActions` is provided.
   */
  getActionModel?: ((item: TItem) => RegisteredActionContext['models'][number]) | null
  /**
   * Returns a stable, unique key for a row item. Used to track rows across re-renders.
   */
  getKey: (item: TItem) => string
  /**
   * Maps a row item to a route location. Used by the mobile list's expanded-card "Go to
   * detail" button, and will be reused by the detail pane's Cmd+O once that ships. Return
   * `null` to disable navigation for a specific row.
   */
  getLink?: ((item: TItem) => RegisteredRouteLocationRaw | null) | null
  /**
   * Groups rows by this column's value, rendering a collapsible group header row above each
   * distinct value. Pass a two-element tuple to additionally sub-group within each group by a
   * second column — there is no third level. Groups default to expanded. Grouped rows and
   * headers are virtualized (see `CONTEXT.md`), same as the flat, ungrouped list.
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
   * Called when the user scrolls near the end of the loaded rows, or when the loaded rows
   * don't fill the scroll container at all — the signal to fetch the next page. Pass `null`
   * (default) when there is no next page, e.g. all data is already loaded client-side.
   */
  onNextPage?: (() => void) | null
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
}
