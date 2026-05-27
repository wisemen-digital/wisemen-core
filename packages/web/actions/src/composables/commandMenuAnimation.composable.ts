import type { Ref } from 'vue'
import {
  nextTick,
  ref,
  watch,
} from 'vue'

export function useCommandMenuAnimation(
  isOpen: Ref<boolean>,
  getNavStackLength: () => number,
) {
  const isBouncing = ref(false)
  const hasNavigated = ref(false)
  let bounceTimeout: ReturnType<typeof setTimeout> | null = null

  watch(isOpen, (value) => {
    if (!value) {
      hasNavigated.value = false
    }
  })

  watch(getNavStackLength, () => {
    hasNavigated.value = true

    if (bounceTimeout !== null) {
      clearTimeout(bounceTimeout)
      isBouncing.value = false
    }

    nextTick(() => {
      isBouncing.value = true
      bounceTimeout = setTimeout(() => {
        isBouncing.value = false
      }, 250)
    })
  })

  return {
    hasNavigated,
    isBouncing,
  }
}
