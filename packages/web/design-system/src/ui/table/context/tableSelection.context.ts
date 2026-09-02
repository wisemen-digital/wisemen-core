import type { ComputedRef } from 'vue'

import { useContext } from '@/composables/context.composable'

interface TableSelectionContext {
  isAllSelected: ComputedRef<boolean>
  isGroupAllSelected: (items: unknown[]) => boolean
  isGroupIndeterminate: (items: unknown[]) => boolean
  isIndeterminate: ComputedRef<boolean>
  isItemSelected: (key: string) => boolean
  isSelectable: ComputedRef<boolean>
  toggleAll: () => void
  toggleGroup: (items: unknown[]) => void
  toggleItem: (key: string, isRangeSelect?: boolean) => void
}

export const [
  useProvideTableSelectionContext,
  useInjectTableSelectionContext,
] = useContext<TableSelectionContext>('tableSelectionContext')
