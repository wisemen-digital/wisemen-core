import { useInfiniteScroll } from '@vueuse/core'
import type {
  ComputedRef,
  Ref,
} from 'vue'
import {
  ref,
  watch,
} from 'vue'

/**
 * Triggers `onNextPage` when the given scroll container is scrolled near its bottom, and also
 * once up front if the loaded rows don't fill/overflow the container at all — mirrors
 * `ui/table/components/TableRoot.vue`'s pagination trigger. Called once per real DOM scroll
 * container (`DataTable.vue` for desktop, `DataTableMobileList.vue` for mobile) — not once per
 * virtualizer composable, since the desktop flat and grouped virtualizers both run against the
 * same element and only one of them is ever actually rendered.
 */
export function useDataTableInfiniteScroll(
  scrollEl: Ref<HTMLElement | null>,
  onNextPage: ComputedRef<(() => void) | null>,
): void {
  const isScrollableVertically = ref<boolean>(false)

  function updateScrollableState(el: HTMLElement): void {
    isScrollableVertically.value = el.scrollHeight > el.clientHeight
  }

  watch(scrollEl, (el, previousEl, onCleanup) => {
    if (el === null) {
      isScrollableVertically.value = false

      return
    }

    updateScrollableState(el)

    const resizeObserver = new ResizeObserver(() => updateScrollableState(el))

    resizeObserver.observe(el)

    onCleanup(() => resizeObserver.disconnect())
  }, {
    immediate: true,
  })

  useInfiniteScroll(scrollEl, () => onNextPage.value?.(), {
    offset: {
      bottom: 400,
    },
  })

  watch(isScrollableVertically, (canScrollVertically) => {
    if (!canScrollVertically) {
      onNextPage.value?.()
    }
  }, {
    immediate: true,
  })
}
