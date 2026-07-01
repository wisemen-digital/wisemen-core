import type { ApiError } from '@wisemen/vue-core-api-utils'
import type { Component } from 'vue'

import type {
  RegisteredActionContext,
  RegisteredRouteLocationRaw,
} from '@/register'
import type {
  InferTableItem,
  TableColumn,
  TableData,
  TableGroupedData,
} from '@/ui/table/types/table.type'
import type { TableRootProps } from '@/ui/table/types/tableRoot.props'

export interface TableProps<TData extends TableData<unknown>> extends Omit<TableRootProps, 'columnSizes' | 'isInitialized'> {
  /**
   * Whether the next page of results is currently being fetched. Shows a loading indicator
   * at the bottom of the table while paginating.
   */
  isFetchingNextPage: boolean
  /**
   * Whether the initial data fetch is in progress. Shows a full-table loading skeleton
   * until the first set of rows is ready.
   */
  isLoading: boolean
  /**
   * When `true`, a checkbox column is prepended to the table, enabling row selection.
   * Listen to the `select` emit to receive the current selection state as either an
   * `includes` array (individual selections) or an `excludes` array (after select-all).
   */
  isSelectable?: boolean
  /**
   * Column definitions that describe each column's header label, unique key, cell component,
   * optional size constraints, and optional per-column actions.
   */
  columns: TableColumn<TData extends (infer TElement)[] ? TElement : never>[]
  /**
   * The data to render. Supports three shapes:
   * - Flat array — renders a plain list of rows.
   * - `TableGroupedData[]` — renders collapsible row groups with a label row.
   * - `TableSubGroupedData[]` — renders nested collapsible groups.
   */
  data: TData
  /**
   * Error returned by the data fetch, or `null` when there is no error. When non-null
   * the table renders an error state instead of rows.
   */
  error: ApiError | null
  /**
   * Maps a row item to the action context model used by the actions system. Required when
   * `actions` is provided so the action handlers receive the correct model. Set to `null`
   * to explicitly disable per-row action context.
   */
  getActionModel?: ((item: InferTableItem<TData>) => RegisteredActionContext['models'][number]) | null
  /**
   * Returns a stable, unique key for a row item. Used by Vue's virtual DOM to track rows
   * across re-renders — must be unique per item within the data set.
   */
  getKey: (item: InferTableItem<TData>) => string
  /**
   * Maps a row item to a route location, making the entire row a clickable link.
   * Return `null` to disable linking for a specific row.
   * When using other interactable elements inside a cell, wrap them with `UITableCellInteractiveElement`
   * to prevent click events from triggering the row link.
   */
  getLink?: ((item: InferTableItem<TData>) => RegisteredRouteLocationRaw | null) | null
  /**
   * Returns an array of Vue components to render inside a group's header row. Use this to
   * add custom summary cells (e.g. totals) aligned with the table columns for grouped data.
   */
  groupHeaderCells?: (group: TableGroupedData<InferTableItem<TData>>) => Component[]
}
