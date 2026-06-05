import { ref } from 'vue'

export function useTableScrollState() {
  const isScrolledFromLeft = ref<boolean>(false)
  const isScrolledToEnd = ref<boolean>(true)

  function updateScrollState(el: HTMLElement): void {
    isScrolledFromLeft.value = el.scrollLeft > 0
    isScrolledToEnd.value = el.scrollLeft + el.clientWidth >= el.scrollWidth - 1
  }

  function setScrollContainer(el: HTMLElement): void {
    updateScrollState(el)

    el.addEventListener('scroll', () => updateScrollState(el), {
      passive: true,
    })
  }

  return {
    isScrolledFromLeft,
    isScrolledToEnd,
    setScrollContainer,
  }
}
