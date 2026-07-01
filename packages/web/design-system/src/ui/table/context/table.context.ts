import type { Action } from '@wisemen/vue-core-actions'
import type { ComputedRef } from 'vue'

import { useContext } from '@/composables/context.composable'
import type { Sort } from '@/composables/sort.composable'
import type { TableRootProps } from '@/ui/table/types/tableRoot.props'

interface TableContext {
  isColumnResizeDisabled: ComputedRef<boolean>
  isGroupingEnabled: ComputedRef<boolean>
  isResizingColumn: ComputedRef<boolean>
  isScrollableVertically: ComputedRef<boolean>
  isScrolledFromLeft: ComputedRef<boolean>
  isScrolledToEnd: ComputedRef<boolean>
  isSelectable: ComputedRef<boolean>
  actions: ComputedRef<Action[]>
  activeFilterCountIncludingSearch: ComputedRef<number>
  gridTemplateColumns: ComputedRef<string>
  headerActions: ComputedRef<Action[]>
  registerGroup: () => void
  setScrollContainer: (el: HTMLElement) => void
  sort: Sort | null
  unregisterGroup: () => void
  variant: ComputedRef<NonNullable<TableRootProps['variant']>>
  onClearFiltersAndSearch: () => void
  onColumnResizeFitToContent: (columnIndex: number, cellEl: HTMLElement) => void
  onColumnResizeStart: (columnIndex: number, mouseX: number, cellEl: HTMLElement) => void
}

export const [
  useProvideTableContext,
  useInjectTableContext,
] = useContext<TableContext>('tableContext')
