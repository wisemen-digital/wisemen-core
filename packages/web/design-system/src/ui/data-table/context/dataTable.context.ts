import type { ComputedRef } from 'vue'

import { useContext } from '@/composables/context.composable'
import type { Sort } from '@/composables/sort.composable'

interface DataTableContext {
  isFirstColumnSticky: ComputedRef<boolean>
  isLastColumnSticky: ComputedRef<boolean>
  sort: ComputedRef<Sort | null>
}

export const [
  useProvideDataTableContext,
  useInjectDataTableContext,
] = useContext<DataTableContext>('dataTableContext')
