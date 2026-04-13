import type {
  ComputedRef,
  Ref,
} from 'vue'
import {
  computed,
  nextTick,
  onBeforeUnmount,
  onMounted,
  ref,
  watch,
} from 'vue'

interface UseTabsOptions {
  activeValue: ComputedRef<string | null> | Ref<string | null>
}

interface UseTabs {
  hasHorizontalOverflow: ComputedRef<boolean>
  hasReachedHorizontalEnd: ComputedRef<boolean>
  isScrolledHorizontally: ComputedRef<boolean>
  scrollToActiveTab: () => void
  scrollToLeft: () => void
  scrollToRight: () => void
  setScrollContainerRef: (el: HTMLElement) => void
}

export function useTabs(options: UseTabsOptions): UseTabs {
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

  function scrollToActiveTabIfNotFullyVisible(): void {
    if (scrollContainerRef.value === null) {
      return
    }

    const activeTab = scrollContainerRef.value.querySelector('[role="tab"][data-state="active"]') ?? null

    if (activeTab === null) {
      return
    }

    const activeTabRect = activeTab.getBoundingClientRect()
    const scrollContainerRect = scrollContainerRef.value.getBoundingClientRect()

    const isClipped = activeTabRect.left < scrollContainerRect.left
      || activeTabRect.right > scrollContainerRect.right

    if (!isClipped) {
      return
    }

    const targetScrollLeft = activeTabRect.left
      - scrollContainerRect.left
      + scrollContainerRef.value.scrollLeft
      - (scrollContainerRect.width / 2)
      + (activeTabRect.width / 2)

    scrollContainerRef.value.scrollTo({
      behavior: 'smooth',
      left: targetScrollLeft,
    })
  }

  let resizeObserver: ResizeObserver | null = null

  watch(options.activeValue, () => {
    nextTick(() => {
      scrollToActiveTabIfNotFullyVisible()
    })
  })

  onMounted(() => {
    if (scrollContainerRef.value === null) {
      return
    }

    updateScrollState()
    scrollContainerRef.value.addEventListener('scroll', updateScrollState)

    resizeObserver = new ResizeObserver(updateScrollState)
    resizeObserver.observe(scrollContainerRef.value)
  })

  onBeforeUnmount(() => {
    if (scrollContainerRef.value !== null) {
      scrollContainerRef.value.removeEventListener('scroll', updateScrollState)
    }

    resizeObserver?.disconnect()
  })

  return {
    hasHorizontalOverflow: computed<boolean>(() => hasHorizontalOverflow.value),
    hasReachedHorizontalEnd: computed<boolean>(() => hasReachedHorizontalEnd.value),
    isScrolledHorizontally: computed<boolean>(() => isScrolledHorizontally.value),
    scrollToActiveTab: scrollToActiveTabIfNotFullyVisible,
    scrollToLeft,
    scrollToRight,
    setScrollContainerRef,
  }
}
