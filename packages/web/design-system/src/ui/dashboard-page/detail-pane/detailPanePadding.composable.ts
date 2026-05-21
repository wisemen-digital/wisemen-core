import { computed } from 'vue'

import { useIsReducedMotion } from '@/composables/useIsReducedMotion.composable'
import { useInjectDetailPaneContext } from '@/ui/dashboard-page/detail-pane/detailPane.context'

const PADDING_INLINE_BORDERED_OFFSET = 10

export function useDetailPanePadding() {
  const detailPaneContext = useInjectDetailPaneContext(null)

  const isReduceMotionEnabledOnDevice = useIsReducedMotion()

  const contentPaddingRight = computed<string>(() => {
    if (detailPaneContext === null) {
      return '0px'
    }

    if (detailPaneContext.isFloatingDetailPane.value) {
      return '0px'
    }

    if (detailPaneContext.isOpen.value && detailPaneContext.variant === 'bordered-inline') {
      return `calc(${detailPaneContext.sidebarWidth.value} + ${PADDING_INLINE_BORDERED_OFFSET}px)`
    }

    if (detailPaneContext.isOpen.value) {
      return detailPaneContext.sidebarWidth.value
    }

    return '0px'
  })

  const isResizing = computed<boolean>(() => detailPaneContext?.isResizing.value ?? false)

  const transitionDuration = computed<number>(() => {
    if (isResizing.value) {
      return 0
    }

    return isReduceMotionEnabledOnDevice.value ? 0 : 0.3
  })

  return {
    contentPaddingRight,
    transitionDuration,
  }
}
