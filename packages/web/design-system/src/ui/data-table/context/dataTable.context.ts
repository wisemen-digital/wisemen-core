import type { ComputedRef } from 'vue'

import { useContext } from '@/composables/context.composable'
import type { Sort } from '@/composables/sort.composable'

interface DataTableContext {
  /** Column id carrying the sticky-left group's trailing border, or `null` if none pinned. */
  leftStickyBorderColumnId: ComputedRef<string | null>
  /** Cumulative left offset (px) per real column pinned left, keyed by column id. */
  leftStickyOffsetPxByColumnId: ComputedRef<Map<string, number>>
  /** Mirrors `leftStickyBorderColumnId` for the right-pinned group. */
  rightStickyBorderColumnId: ComputedRef<string | null>
  /** Mirrors `leftStickyOffsetPxByColumnId` for the right edge. */
  rightStickyOffsetPxByColumnId: ComputedRef<Map<string, number>>
  /**
   * True when the checkbox column is sticky but nothing else joins it (no expand column, no real
   * column pinned left) — it needs its own trailing border since it's the whole sticky region.
   */
  hasCheckboxOwnStickyBorder: ComputedRef<boolean>
  isColumnResizeDisabled: ComputedRef<boolean>
  isFirstColumnSticky: ComputedRef<boolean>
  isLastColumnSticky: ComputedRef<boolean>
  /** Whether the checkbox/expand columns should render sticky (true once anything is pinned left). */
  isLeadingStickyRegionActive: ComputedRef<boolean>
  /**
   * Whether the scroll container is currently scrolled away from its left/right edge — a sticky
   * region's trailing border only draws once there's actually scrolled content underneath it, not
   * merely because the region is pinned. A table that never needs to scroll shows no border.
   */
  isScrolledFromLeft: ComputedRef<boolean>
  /** Mirrors `isScrolledFromLeft` for the right edge. */
  isScrolledFromRight: ComputedRef<boolean>
  /** Left offset (px) for the checkbox/expand columns themselves. */
  leadingStickyOffsetsPx: ComputedRef<{ checkbox: number
    expand: number }>
  setColumnSize: (columnKey: string, widthPx: number) => void
  sort: ComputedRef<Sort | null>
}

export const [
  useProvideDataTableContext,
  useInjectDataTableContext,
] = useContext<DataTableContext>('dataTableContext')
