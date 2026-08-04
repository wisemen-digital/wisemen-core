import type { ComputedRef } from 'vue'

import { useContext } from '@/composables/context.composable'
import type { Sort } from '@/composables/sort.composable'

interface DataTableContext {
  isColumnResizeDisabled: ComputedRef<boolean>
  isFirstColumnSticky: ComputedRef<boolean>
  isLastColumnSticky: ComputedRef<boolean>
  setColumnSize: (columnKey: string, widthPx: number) => void
  sort: ComputedRef<Sort | null>
}

export const [
  useProvideDataTableContext,
  useInjectDataTableContext,
] = useContext<DataTableContext>('dataTableContext')
