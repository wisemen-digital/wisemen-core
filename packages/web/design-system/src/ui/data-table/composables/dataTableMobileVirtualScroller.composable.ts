import type { VirtualItem } from '@tanstack/vue-virtual'
import { useVirtualizer } from '@tanstack/vue-virtual'
import type {
  ComponentPublicInstance,
  Ref,
} from 'vue'
import { computed } from 'vue'

import type { DataTableRowViewModel } from '@/ui/data-table/types/dataTableRowViewModel.type'

export const DATA_TABLE_MOBILE_GROUP_HEADER_HEIGHT_IN_PX = 36
export const DATA_TABLE_MOBILE_CARD_HEIGHT_IN_PX = 64

/**
 * Virtualizes the mobile card list using dynamic per-row measurement — group-header rows,
 * collapsed cards, and expanded cards all have different real heights, and a card's own height
 * changes in place when it's expanded/collapsed. `estimateSize` below is only the initial guess;
 * `measureElement` (wired via the `measureRowElement` ref callback in the template) corrects it
 * after each row actually renders, and re-corrects it when an already-mounted row's height
 * changes (e.g. expand toggle). See `dataTableGroupedVirtualScroller.composable.ts`, which this
 * mirrors for the desktop grouped case.
 */
export function useDataTableMobileVirtualScroller<TItem>(
  rowViewModels: Ref<DataTableRowViewModel<TItem>[]>,
  scrollEl: Ref<HTMLElement | null>,
): {
  measureRowElement: (el: ComponentPublicInstance | Element | null) => void
  paddingAfterPx: Readonly<Ref<number>>
  paddingBeforePx: Readonly<Ref<number>>
  virtualItems: Readonly<Ref<VirtualItem[]>>
} {
  const virtualizer = useVirtualizer(computed(() => ({
    count: rowViewModels.value.length,
    estimateSize: (index: number): number => (
      rowViewModels.value[index]?.isGrouped ?? false
        ? DATA_TABLE_MOBILE_GROUP_HEADER_HEIGHT_IN_PX
        : DATA_TABLE_MOBILE_CARD_HEIGHT_IN_PX
    ),
    // Stable row id, not the array index — a group collapsing removes rows from the middle
    // of the array and shifts every subsequent index, which would otherwise reuse a stale
    // cached size for the wrong row.
    getItemKey: (index: number): string => rowViewModels.value[index]?.row.id ?? String(index),
    getScrollElement: (): HTMLElement | null => scrollEl.value,
    overscan: 5,
  })))

  const virtualItems = computed<VirtualItem[]>(() => virtualizer.value.getVirtualItems())
  const totalSizePx = computed<number>(() => virtualizer.value.getTotalSize())

  const paddingBeforePx = computed<number>(() => virtualItems.value.at(0)?.start ?? 0)
  const paddingAfterPx = computed<number>(() => {
    const last = virtualItems.value.at(-1)

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
