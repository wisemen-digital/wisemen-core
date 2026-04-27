import type { Ref } from 'vue'
import {
  ref,
  watch,
} from 'vue'

interface UseDialogScrollReturn {
  isScrolledToBottom: Ref<boolean>
  isScrolledToTop: Ref<boolean>
  bodyRef: Ref<HTMLElement | null>
}

export function useDialogScroll(): UseDialogScrollReturn {
  const bodyRef = ref<HTMLElement | null>(null)
  const isScrolledToTop = ref<boolean>(true)
  const isScrolledToBottom = ref<boolean>(true)

  function updateScrollState(): void {
    const el = bodyRef.value

    if (el === null) {
      return
    }

    const scrollThreshold = 1

    isScrolledToTop.value = el.scrollTop <= scrollThreshold
    isScrolledToBottom.value = el.scrollTop + el.clientHeight >= el.scrollHeight - scrollThreshold
  }

  let resizeObserver: ResizeObserver | null = null

  watch(bodyRef, (el, _oldEl, onCleanup) => {
    if (el === null) {
      return
    }

    el.addEventListener('scroll', updateScrollState, {
      passive: true,
    })

    resizeObserver = new ResizeObserver(updateScrollState)
    resizeObserver.observe(el)

    updateScrollState()

    onCleanup(() => {
      el.removeEventListener('scroll', updateScrollState)
      resizeObserver?.disconnect()
      resizeObserver = null
    })
  }, {
    immediate: true,
  })

  return {
    isScrolledToBottom,
    isScrolledToTop,
    bodyRef,
  }
}
