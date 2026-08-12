import type { Row } from '@tanstack/vue-table'
import type { VirtualItem } from '@tanstack/vue-virtual'
import { useVirtualizer } from '@tanstack/vue-virtual'
import type {
  ComponentPublicInstance,
  Ref,
} from 'vue'
import { computed } from 'vue'

import {
  findMissingAncestorHeaderItems,
  getPaddingBeforePxWithInjectedAncestors,
} from '@/ui/data-table/utils/dataTableStickyGroupHeaders.util'

export const DATA_TABLE_ROW_HEIGHT_IN_PX = 40
export const DATA_TABLE_GROUP_ROW_HEIGHT_IN_PX = 40

/**
 * Virtualizes a flat, already-expansion-aware row sequence (`table.getRowModel().rows`,
 * which interleaves group-header rows with data rows and already excludes collapsed groups'
 * children) using dynamic per-row measurement — group-header rows and data rows have
 * different real heights, so a single fixed `estimateSize` (as flat-list virtualization uses)
 * would misplace every row after the first group. `estimateSize` below is only the initial
 * guess; `measureElement` (wired via the `measureRowElement` ref callback in the template)
 * corrects it after each row actually renders.
 */
export function useDataTableGroupedVirtualScroller<TItem>(
  rows: Ref<Row<TItem>[]>,
  scrollEl: Ref<HTMLElement | null>,
): {
  measureRowElement: (el: ComponentPublicInstance | Element | null) => void
  paddingAfterPx: Readonly<Ref<number>>
  paddingBeforePx: Readonly<Ref<number>>
  virtualItems: Readonly<Ref<VirtualItem[]>>
} {
  const virtualizer = useVirtualizer(computed(() => ({
    count: rows.value.length,
    estimateSize: (index: number): number => (
      rows.value[index]?.getIsGrouped() ?? false
        ? DATA_TABLE_GROUP_ROW_HEIGHT_IN_PX
        : DATA_TABLE_ROW_HEIGHT_IN_PX
    ),
    // Stable row id, not the array index — a group collapsing removes rows from the middle
    // of the array and shifts every subsequent index, which would otherwise reuse a stale
    // cached size for the wrong row.
    getItemKey: (index: number): string => rows.value[index]?.id ?? String(index),
    getScrollElement: (): HTMLElement | null => scrollEl.value,
    overscan: 5,
  })))

  const rawVirtualItems = computed<VirtualItem[]>(() => virtualizer.value.getVirtualItems())
  const totalSizePx = computed<number>(() => virtualizer.value.getTotalSize())

  // See `dataTableStickyGroupHeaders.util.ts` for why this is needed and how it works — in
  // short, real `position: sticky` needs a group header's own row to stay mounted in the DOM
  // for as long as it's the active ancestor of whatever's at the top of the viewport, which the
  // virtualizer's normal render window (visible rows plus a small buffer) doesn't guarantee on
  // its own once a header scrolls far enough away.
  const injectedAncestorItems = computed<VirtualItem[]>(() => findMissingAncestorHeaderItems(
    rawVirtualItems.value,
    (index) => {
      const row = rows.value[index]

      return row !== undefined && row.getIsGrouped() ? row.depth : null
    },
    (index) => virtualizer.value.measurementsCache[index],
  ))

  const virtualItems = computed<VirtualItem[]>(() => (
    injectedAncestorItems.value.length === 0
      ? rawVirtualItems.value
      : [...injectedAncestorItems.value, ...rawVirtualItems.value]
  ))

  const paddingBeforePx = computed<number>(
    () => getPaddingBeforePxWithInjectedAncestors(rawVirtualItems.value, injectedAncestorItems.value),
  )
  const paddingAfterPx = computed<number>(() => {
    const last = rawVirtualItems.value.at(-1)

    return last != null ? totalSizePx.value - last.end : 0
  })

  // `null` is meaningful here, not just a guard case — it tells the virtualizer to unobserve
  // the previous element's ResizeObserver entry when a row leaves the DOM. The wrapper this is
  // bound to in the template is always a plain `div`, never a component, and must carry a
  // `data-index` attribute matching its virtual item's index — the virtualizer reads the index
  // back off the element itself (via `indexFromElement`) rather than from this callback's args.
  function measureRowElement(el: ComponentPublicInstance | Element | null): void {
    virtualizer.value.measureElement(el as Element | null)
  }

  return {
    measureRowElement,
    paddingAfterPx,
    paddingBeforePx,
    virtualItems,
  }
}
