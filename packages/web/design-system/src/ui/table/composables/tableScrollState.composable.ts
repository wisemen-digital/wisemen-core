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

    const resizeObserver = new ResizeObserver(() => updateScrollState(el))

    resizeObserver.observe(el)
  }

  return {
    isScrollableVertically,
    isScrolledFromLeft,
    isScrolledToEnd,
    setScrollContainer,
  }
}
