import type { MaybeRefOrGetter } from 'vue'
import {
  onBeforeUnmount,
  ref,
  toValue,
  watch,
} from 'vue'

function checkIfTruncated(el: HTMLElement): boolean {
  const {
    clientHeight,
    clientWidth,
    scrollHeight,
    scrollWidth,
  } = el

  return scrollHeight > clientHeight || scrollWidth > clientWidth
}

export function useIsTruncated(el: MaybeRefOrGetter<HTMLElement | null>) {
  const isTruncated = ref<boolean>(false)
  let resizeObserver: ResizeObserver | null = null

  // Re-observes whenever the target element changes — the element can be swapped (not just
  // mounted once) when a consumer conditionally re-parents it, e.g. `UIText` only wrapping its
  // content in a tooltip once truncation is detected.
  watch(() => toValue(el), (element) => {
    resizeObserver?.disconnect()
    resizeObserver = null

    if (element === null) {
      return
    }

    // Don't measure synchronously here — at this point the element may not have its final
    // layout/styles applied yet. `ResizeObserver.observe()` always fires its callback once
    // with the element's current (settled) size, so let that be the only source of truth.
    resizeObserver = new ResizeObserver(() => {
      isTruncated.value = checkIfTruncated(element)
    })
    resizeObserver.observe(element)
  }, {
    flush: 'post',
    immediate: true,
  })

  onBeforeUnmount(() => {
    resizeObserver?.disconnect()
  })

  return isTruncated
}
