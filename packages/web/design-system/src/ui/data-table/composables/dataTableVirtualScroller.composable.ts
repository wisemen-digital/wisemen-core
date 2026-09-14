import type { VirtualItem } from '@tanstack/vue-virtual'
import { useVirtualizer } from '@tanstack/vue-virtual'
import type { Ref } from 'vue'
import { computed } from 'vue'

export const DATA_TABLE_ROW_HEIGHT_IN_PX = 40

export function useDataTableVirtualScroller(
  count: Ref<number>,
  scrollEl: Ref<HTMLElement | null>,
): {
  paddingAfterPx: Readonly<Ref<number>>
  paddingBeforePx: Readonly<Ref<number>>
  virtualItems: Readonly<Ref<VirtualItem[]>>
} {
  const virtualizer = useVirtualizer(computed(() => ({
    count: count.value,
    estimateSize: (): number => DATA_TABLE_ROW_HEIGHT_IN_PX,
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

  return {
    paddingAfterPx,
    paddingBeforePx,
    virtualItems,
  }
}
