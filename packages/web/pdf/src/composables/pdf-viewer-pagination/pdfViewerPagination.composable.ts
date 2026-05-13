import {
  computed,
  onBeforeUnmount,
  ref,
  toValue,
} from 'vue'

import type {
  ComputedRef,
  MaybeRefOrGetter,
  Ref,
} from 'vue'

interface UsePdfViewerPaginationOptions {
  container: MaybeRefOrGetter<HTMLElement | null>
  pageSelector?: MaybeRefOrGetter<string>
  threshold?: MaybeRefOrGetter<number>
  totalPages?: MaybeRefOrGetter<number | null>
}

export type PdfViewerPaginationReturn = ReturnType<typeof usePdfViewerPagination>

export function usePdfViewerPagination(options: UsePdfViewerPaginationOptions) {
  const currentPage = ref<number>(1) as Ref<number>
  const observedPages = ref<HTMLElement[]>([]) as Ref<HTMLElement[]>
  const intersectionObserver = ref<IntersectionObserver | null>(null) as Ref<IntersectionObserver | null>

  const totalPages = computed<number>(() => {
    if (options.totalPages === undefined) {
      return observedPages.value.length
    }

    return toValue(options.totalPages) ?? observedPages.value.length
  })

  const canGoToPreviousPage = computed<boolean>(() => currentPage.value > 1)
  const canGoToNextPage = computed<boolean>(() => currentPage.value < totalPages.value)

  function observePages(): void {
    disconnect()

    const container = toValue(options.container)

    if (container === null) {
      return
    }

    const pageSelector = options.pageSelector === undefined
      ? 'article'
      : toValue(options.pageSelector)

    observedPages.value = Array.from(container.querySelectorAll<HTMLElement>(pageSelector))

    intersectionObserver.value = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (!entry.isIntersecting) {
            continue
          }

          const index = observedPages.value.indexOf(entry.target as HTMLElement)

          if (index === -1) {
            continue
          }

          currentPage.value = index + 1
        }
      },
      {
        root: container,
        threshold: options.threshold === undefined ? 0.5 : toValue(options.threshold),
      },
    )

    for (const page of observedPages.value) {
      intersectionObserver.value.observe(page)
    }
  }

  function disconnect(): void {
    intersectionObserver.value?.disconnect()
    intersectionObserver.value = null
    observedPages.value = []
  }

  function goToPage(page: number): void {
    const pageIndex = Math.min(Math.max(page, 1), totalPages.value) - 1
    const targetPage = observedPages.value[pageIndex]

    if (targetPage === undefined) {
      return
    }

    targetPage.scrollIntoView({
      behavior: 'smooth',
      block: 'start',
    })
    currentPage.value = pageIndex + 1
  }

  function nextPage(): void {
    if (!canGoToNextPage.value) {
      return
    }

    goToPage(currentPage.value + 1)
  }

  function previousPage(): void {
    if (!canGoToPreviousPage.value) {
      return
    }

    goToPage(currentPage.value - 1)
  }

  onBeforeUnmount(() => {
    disconnect()
  })

  return {
    canGoToNextPage: canGoToNextPage as ComputedRef<boolean>,
    canGoToPreviousPage: canGoToPreviousPage as ComputedRef<boolean>,
    currentPage,
    disconnect,
    goToPage,
    nextPage,
    observePages,
    observedPages,
    previousPage,
    totalPages,
  }
}
