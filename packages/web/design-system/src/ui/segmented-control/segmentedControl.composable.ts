import { useResizeObserver } from '@vueuse/core'
import type { ComputedRef } from 'vue'
import {
  computed,
  onMounted,
  ref,
  watch,
} from 'vue'

interface UseSegmentedControlDescriptionTracker {
  hasDescription: ComputedRef<boolean>
  registerItem: (hasDescription: boolean) => void
  unregisterItem: (hasDescription: boolean) => void
}

export function useSegmentedControlDescriptionTracker(): UseSegmentedControlDescriptionTracker {
  const descriptionItemCount = ref<number>(0)
  const hasDescription = computed<boolean>(() => descriptionItemCount.value > 0)

  function registerItem(itemHasDescription: boolean): void {
    if (itemHasDescription) {
      descriptionItemCount.value += 1
    }
  }

  function unregisterItem(itemHasDescription: boolean): void {
    if (itemHasDescription) {
      descriptionItemCount.value -= 1
    }
  }

  return {
    hasDescription,
    registerItem,
    unregisterItem,
  }
}

interface UseSegmentedControlIndicatorOptions {
  activeValue: ComputedRef<string | null>
  listRef: ComputedRef<HTMLElement | null>
}

interface UseSegmentedControlIndicator {
  isReady: ComputedRef<boolean>
  indicatorCrossSize: ComputedRef<string>
  indicatorPosition: ComputedRef<string>
  indicatorSize: ComputedRef<string>
}

export function useSegmentedControlIndicator(
  options: UseSegmentedControlIndicatorOptions,
): UseSegmentedControlIndicator {
  const size = ref<number>(0)
  const crossSize = ref<number>(0)
  const position = ref<number>(0)
  const isReady = ref<boolean>(false)

  function updateIndicatorStyle(): void {
    const listEl = options.listRef.value

    if (listEl === null) {
      isReady.value = false

      return
    }

    const activeItem = listEl.querySelector<HTMLElement>('[role="radio"][data-active]')

    if (activeItem === null) {
      isReady.value = false

      return
    }

    const listRect = listEl.getBoundingClientRect()
    const itemRect = activeItem.getBoundingClientRect()

    size.value = itemRect.width
    crossSize.value = itemRect.height
    position.value = itemRect.left - listRect.left
    isReady.value = true
  }

  watch(options.activeValue, () => {
    updateIndicatorStyle()
  })

  watch(options.listRef, () => {
    updateIndicatorStyle()
  })

  onMounted(() => {
    updateIndicatorStyle()
  })

  useResizeObserver(options.listRef, () => {
    updateIndicatorStyle()
  })

  return {
    isReady: computed<boolean>(() => isReady.value),
    indicatorCrossSize: computed<string>(() => `${crossSize.value}px`),
    indicatorPosition: computed<string>(() => `${position.value}px`),
    indicatorSize: computed<string>(() => `${size.value}px`),
  }
}
