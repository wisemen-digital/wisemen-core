import { ref } from 'vue'

export function useTableScrollState() {
  const isScrolledFromLeft = ref<boolean>(false)
  const isScrolledToEnd = ref<boolean>(true)
  const isScrollableVertically = ref<boolean>(false)

  function updateScrollState(el: HTMLElement): void {
    isScrolledFromLeft.value = el.scrollLeft > 0
    isScrolledToEnd.value = el.scrollLeft + el.clientWidth >= el.scrollWidth - 1
    isScrollableVertically.value = el.scrollHeight > el.clientHeight
  }

  function setScrollContainer(el: HTMLElement): void {
    updateScrollState(el)

    el.addEventListener('scroll', () => updateScrollState(el), {
      passive: true,
    })

    // Observe both the container (viewport size changes) and its content (rows being
    // added/removed). The container's own box size stays clamped once it hits `max-h-full`,
    // so appended rows only change `scrollHeight`, which a ResizeObserver on `el` alone
    // would never pick up.
    const resizeObserver = new ResizeObserver(() => updateScrollState(el))

    resizeObserver.observe(el)

    // `el.children[0]` is the grid content wrapper rendered by TableScrollContainer.vue.
    const contentEl = el.children[0]

    if (contentEl !== undefined) {
      resizeObserver.observe(contentEl)
    }
  }

  return {
    isScrollableVertically,
    isScrolledFromLeft,
    isScrolledToEnd,
    setScrollContainer,
  }
}
