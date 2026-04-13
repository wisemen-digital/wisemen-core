import type { MaybeRefOrGetter } from 'vue'
import {
  onBeforeUnmount,
  onMounted,
  ref,
  toValue,
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

  function observe(el: HTMLElement): void {
    resizeObserver = new ResizeObserver(() => {
      isTruncated.value = checkIfTruncated(el)
    })
    resizeObserver.observe(el)
  }

  onMounted(() => {
    const element = toValue(el)

    if (element === null) {
      throw new Error('Element is null')
    }

    observe(element)
  })

  onBeforeUnmount(() => {
    resizeObserver?.disconnect()
  })

  return isTruncated
}
