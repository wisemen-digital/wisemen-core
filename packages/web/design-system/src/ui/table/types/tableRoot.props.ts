import type {
  Action,
  ActionGroup,
} from '@wisemen/vue-core-actions'

import type { TableColumnSize } from '@/ui/table/types/table.type'

export interface TableRootProps {
  /**
   *
   */
  hasActiveSearch?: boolean
  /**
   *
   */
  isInitialized: boolean
  /**
   *
   */
  actionGroup?: ActionGroup | null
  /**
   *
   */
  actions?: Action[]
  /**
   *
   */
  activeFilterCount?: number
  /**
   *
   */
  columnSizes: TableColumnSize[]
  /**
   *
   */
  disableColumnResize?: boolean
  /**
   *
   */
  headerActions?: Action[]
  /**
   *
   */
  variant?: 'contained' | 'full-page'
  /**
   *
   */
  onNextPage?: () => void
}
