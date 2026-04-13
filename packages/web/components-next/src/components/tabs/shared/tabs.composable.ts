import type { ComputedRef } from 'vue'
import {
  computed,
  onBeforeUnmount,
  onMounted,
  ref,
} from 'vue'

interface UseTabs {
  hasHorizontalOverflow: ComputedRef<boolean>
  hasReachedHorizontalEnd: ComputedRef<boolean>
  isScrolledHorizontally: ComputedRef<boolean>
  scrollToActiveTab: () => void
  scrollToLeft: () => void
  scrollToRight: () => void
  setScrollContainerRef: (el: HTMLElement) => void
}

export function useTabs(): UseTabs {
  const scrollContainerRef = ref<HTMLElement | null>(null)

  const isScrolledHorizontally = ref<boolean>(false)
  const hasReachedHorizontalEnd = ref<boolean>(false)
  const hasHorizontalOverflow = ref<boolean>(false)

  function setScrollContainerRef(el: HTMLElement): void {
    scrollContainerRef.value = el
  }

  function updateScrollState(): void {
    const el = scrollContainerRef.value

    if (el === null) {
      return
    }

    isScrolledHorizontally.value = el.scrollLeft > 0
    hasReachedHorizontalEnd.value = el.scrollLeft + el.clientWidth >= el.scrollWidth - 1
    hasHorizontalOverflow.value = el.scrollWidth > el.clientWidth
  }

  function scrollToLeft(): void {
    if (scrollContainerRef.value === null) {
      return
    }

    scrollContainerRef.value.scrollTo({
      behavior: 'smooth',
      left: scrollContainerRef.value.scrollLeft - 200,
    })
  }

  function scrollToRight(): void {
    if (scrollContainerRef.value === null) {
      return
    }

    scrollContainerRef.value.scrollTo({
      behavior: 'smooth',
      left: scrollContainerRef.value.scrollLeft + 200,
    })
  }

  function scrollToActiveTab(): void {
    if (scrollContainerRef.value === null) {
      return
    }

    const activeTab = scrollContainerRef.value.querySelector('[role="tab"][data-state="active"]') ?? null

    if (activeTab === null) {
      return
    }

    const activeTabRect = activeTab.getBoundingClientRect()
    const scrollContainerRect = scrollContainerRef.value.getBoundingClientRect()

    scrollContainerRef.value.scrollTo({
      behavior: 'instant',
      left: activeTabRect.left - scrollContainerRect.left + scrollContainerRef.value.scrollLeft,
    })
  }

  onMounted(() => {
    if (scrollContainerRef.value === null) {
      throw new Error('Scroll container ref is null')
    }

    updateScrollState()
    scrollContainerRef.value.addEventListener('scroll', updateScrollState)
    scrollContainerRef.value.addEventListener('resize', updateScrollState)
  })

  onBeforeUnmount(() => {
    if (scrollContainerRef.value === null) {
      return
    }

    scrollContainerRef.value.removeEventListener('scroll', updateScrollState)
    scrollContainerRef.value.removeEventListener('resize', updateScrollState)
  })

  return {
    hasHorizontalOverflow: computed<boolean>(() => hasHorizontalOverflow.value),
    hasReachedHorizontalEnd: computed<boolean>(() => hasReachedHorizontalEnd.value),
    isScrolledHorizontally: computed<boolean>(() => isScrolledHorizontally.value),
    scrollToActiveTab,
    scrollToLeft,
    scrollToRight,
    setScrollContainerRef,
  }
}
