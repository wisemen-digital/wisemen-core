import type {
  Action,
  ActionGroup,
} from '@wisemen/vue-core-actions'

import type { TableColumnSize } from '@/ui/table/types/table.type'

export interface TableRootProps {
  /**
   * Whether a search query is currently active. When `true`, the empty state will
   * indicate no results were found for the search instead of showing the generic empty state.
   */
  hasActiveSearch?: boolean
  /**
   * Whether the table has completed its initial data fetch. Controls whether the table
   * renders its content or shows a loading skeleton.
   */
  isInitialized: boolean
  /**
   * An action group displayed in the table toolbar, typically shown when one or more
   * rows are selected.
   */
  actionGroup?: ActionGroup | null
  /**
   * Row-level actions available in the context menu or action column for each row.
   */
  actions?: Action[]
  /**
   * Number of filters currently active. Displayed as a badge on the filter button
   * so users can see at a glance how many filters are applied.
   */
  activeFilterCount?: number
  /**
   * Min/max size constraints for each column, in the same order as the column definitions.
   * Used to build the CSS `grid-template-columns` value.
   */
  columnSizes: TableColumnSize[]
  /**
   * When `true`, the column resize handles are hidden and users cannot drag to resize columns.
   */
  disableColumnResize?: boolean
  /**
   * Actions rendered in the table header toolbar (top-right area), independent of row selection.
   */
  headerActions?: Action[]
  /**
   * Visual style variant of the table.
   * - `contained` — table has a border and rounded corners, suitable for embedding inside a page.
   * - `full-page` — table stretches edge-to-edge, suitable for full-page list views.
   * @default 'contained'
   */
  variant?: 'contained' | 'full-page'
  /**
   * Called when the user scrolls to the bottom of the table. Implement to fetch the next
   * page of data for infinite-scroll pagination. Omit when all data is loaded at once.
   */
  onNextPage?: () => void
}
