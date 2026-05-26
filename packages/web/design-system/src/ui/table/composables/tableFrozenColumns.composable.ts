import { useResizeObserver } from '@vueuse/core'
import type { ComputedRef } from 'vue'
import {
  nextTick,
  ref,
  watch,
} from 'vue'

import type { TableColumnSize } from '@/ui/table/types/table.type'

export function useTableFrozenColumns(
  columnSizes: ComputedRef<TableColumnSize[]>,
  isInitialized: ComputedRef<boolean>,
  scrollContainerEl: ComputedRef<HTMLElement | null>,
) {
  const frozenColumns = ref<string | null>(null)

  watch([
    scrollContainerEl,
    isInitialized,
    columnSizes,
  ], ([
    el,
    isInitialized,
  ]) => {
    if (el === null || !isInitialized) {
      return
    }

    recalculateFrozenColumns(el)
  })

  async function recalculateFrozenColumns(element: HTMLElement): Promise<void> {
    frozenColumns.value = null
    await nextTick()
    frozenColumns.value = getComputedStyle(element).gridTemplateColumns
  }

  let lastWidth = 0

  useResizeObserver(scrollContainerEl, (entries) => {
    const width = entries[0]?.borderBoxSize[0]?.inlineSize
    const hasWidthChanged = width !== undefined && width !== lastWidth

    if (hasWidthChanged) {
      lastWidth = width
      recalculateFrozenColumns(scrollContainerEl.value!)
    }
  }, {
    box: 'border-box',
  })

  return {
    frozenColumns,
  }
}
