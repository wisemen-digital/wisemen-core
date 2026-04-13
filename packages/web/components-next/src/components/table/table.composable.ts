import {
  computed,
  onBeforeUnmount,
  onMounted,
  ref,
} from 'vue'

export function useTable() {
  const tableScrollContainerRef = ref<HTMLElement | null>(null)

  const isScrolledHorizontally = ref<boolean>(false)
  const hasReachedHorizontalEnd = ref<boolean>(false)
  const hasVerticalOverflow = ref<boolean>(false)

  function setTableScrollContainerRef(el: HTMLElement): void {
    tableScrollContainerRef.value = el
  }

  function updateScrollState(): void {
    const el = tableScrollContainerRef.value

    if (el === null) {
      return
    }

    isScrolledHorizontally.value = el.scrollLeft > 0
    hasReachedHorizontalEnd.value = el.scrollLeft + el.clientWidth >= el.scrollWidth - 1
    hasVerticalOverflow.value = el.scrollHeight > el.clientHeight
  }

  onMounted(() => {
    if (tableScrollContainerRef.value === null) {
      throw new Error('Table scroll container ref is null')
    }

    updateScrollState()
    tableScrollContainerRef.value.addEventListener('scroll', updateScrollState)
    tableScrollContainerRef.value.addEventListener('resize', updateScrollState)
  })

  onBeforeUnmount(() => {
    if (tableScrollContainerRef.value === null) {
      return
    }

    tableScrollContainerRef.value.removeEventListener('scroll', updateScrollState)
    tableScrollContainerRef.value.removeEventListener('resize', updateScrollState)
  })

  return {
    hasReachedHorizontalEnd: computed<boolean>(() => hasReachedHorizontalEnd.value),
    hasVerticalOverflow: computed<boolean>(() => hasVerticalOverflow.value),
    isScrolledHorizontally: computed<boolean>(() => isScrolledHorizontally.value),
    setTableScrollContainerRef,
    tableScrollContainerRef,
  }
}
