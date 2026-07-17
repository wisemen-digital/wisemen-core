import { useResizeObserver } from '@vueuse/core'
import type { Ref } from 'vue'
import {
  computed,
  ref,
  watch,
} from 'vue'

export interface UseAdaptiveContentWidthReturn {
  contentRef: Ref<HTMLElement | null>
  style: Ref<{ minWidth: string } | null>
}

/**
 * Lets a popover/menu content element grow wider than its default min-width
 * to fit its content. While open, it remembers the widest size it has
 * rendered at so it never shrinks back down again, preventing layout shifts
 * when content changes. This is reset each time it is reopened.
 */
export function useAdaptiveContentWidth(
  isEnabled: () => boolean,
  isOpen: () => boolean,
): UseAdaptiveContentWidthReturn {
  const contentRef = ref<HTMLElement | null>(null)
  const widestContentWidth = ref<number | null>(null)

  watch(isOpen, (open) => {
    if (open) {
      widestContentWidth.value = null
    }
  })

  useResizeObserver(contentRef, (entries) => {
    if (!isEnabled()) {
      return
    }

    const width = entries[0]?.borderBoxSize[0]?.inlineSize

    if (width !== undefined && width > (widestContentWidth.value ?? 0)) {
      widestContentWidth.value = width
    }
  }, {
    box: 'border-box',
  })

  const style = computed<{ minWidth: string } | null>(() => {
    if (!isEnabled() || widestContentWidth.value === null) {
      return null
    }

    return {
      minWidth: `${widestContentWidth.value}px`,
    }
  })

  return {
    contentRef,
    style,
  }
}
