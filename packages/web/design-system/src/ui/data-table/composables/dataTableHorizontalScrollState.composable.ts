import type { Ref } from 'vue'
import {
  computed,
  ref,
  watch,
} from 'vue'

/**
 * Tracks whether the given scroll container is currently scrolled away from its left/right edge
 * — mirrors `ui/table/composables/tableScrollState.composable.ts`'s `isScrolledFromLeft`, mirrored
 * for the right edge too. Used to only draw a sticky column's edge border once there's actually
 * scrolled content underneath it, not merely because the region is technically pinned — a table
 * with pinned columns that never needs to scroll shows no border at rest.
 */
export function useDataTableHorizontalScrollState(scrollEl: Ref<HTMLElement | null>) {
  const isScrolledFromLeft = ref<boolean>(false)
  const isScrolledFromRight = ref<boolean>(false)

  function updateScrollState(el: HTMLElement): void {
    isScrolledFromLeft.value = el.scrollLeft > 0
    isScrolledFromRight.value = el.scrollLeft + el.clientWidth < el.scrollWidth - 1
  }

  watch(scrollEl, (el, previousEl, onCleanup) => {
    if (el === null) {
      isScrolledFromLeft.value = false
      isScrolledFromRight.value = false

      return
    }

    updateScrollState(el)

    function onScroll(event: Event): void {
      updateScrollState(event.currentTarget as HTMLElement)
    }

    el.addEventListener('scroll', onScroll, {
      passive: true,
    })

    const resizeObserver = new ResizeObserver(() => updateScrollState(el))

    resizeObserver.observe(el)

    // `el.children[0]` is the grid content wrapper — observe it too so a table whose content
    // grows/shrinks (data loading in, columns resizing) re-evaluates without needing a scroll
    // event first.
    const contentEl = el.children[0]

    if (contentEl !== undefined) {
      resizeObserver.observe(contentEl)
    }

    onCleanup(() => {
      el.removeEventListener('scroll', onScroll)
      resizeObserver.disconnect()
    })
  }, {
    immediate: true,
  })

  return {
    isScrolledFromLeft: computed(() => isScrolledFromLeft.value),
    isScrolledFromRight: computed(() => isScrolledFromRight.value),
  }
}
