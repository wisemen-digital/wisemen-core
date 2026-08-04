import { createSharedComposable } from '@vueuse/core'
import { ref } from 'vue'

const OVERLAY_BASE_Z_INDEX = 40

function _useOverlayStack(): { registerOverlay: () => number } {
  const highestZIndex = ref<number>(OVERLAY_BASE_Z_INDEX - 1)

  function registerOverlay(): number {
    highestZIndex.value += 1

    return highestZIndex.value
  }

  return {
    registerOverlay,
  }
}

export const useOverlayStack = createSharedComposable(_useOverlayStack)
