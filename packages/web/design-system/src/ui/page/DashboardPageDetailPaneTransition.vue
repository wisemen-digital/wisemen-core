<script setup lang="ts">
import {
  Motion,
  useReducedMotion,
} from 'motion-v'
import { computed } from 'vue'

import { useInjectDetailPaneContext } from '@/ui/page/detailPane.context'

const {
  isFloatingDetailPane,
  isResizable,
  isResizing,
  sidebarWidth,
  onResizeKeyDown,
  onResizeStart,
} = useInjectDetailPaneContext()

const isReduceMotionEnabledOnDevice = useReducedMotion()

const duration = computed<number>(() => {
  if (isResizing.value) {
    return 0
  }

  return isReduceMotionEnabledOnDevice.value ? 0 : 0.3
})
</script>

<template>
  <Motion
    :initial="{
      translateX: '100%',
    }"
    :animate="{
      translateX: '0%',
    }"
    :exit="{
      translateX: '100%',
    }"
    :transition="{
      duration,
      type: 'spring',
      bounce: 0,
    }"
    :style="{
      width: sidebarWidth,
    }"
    class="
      absolute top-0 right-0 z-4 h-full max-w-full border-l border-secondary
      bg-secondary
      max-md:w-full!
    "
  >
    <!-- eslint-disable vuejs-accessibility/no-static-element-interactions -->
    <div
      v-if="isResizable && !isFloatingDetailPane"
      role="separator"
      aria-orientation="vertical"
      aria-label="Resize detail pane"
      tabindex="0"
      class="
        absolute top-0 left-0 z-10 h-full w-0.5 cursor-col-resize
        transition-colors duration-150
        hover:bg-(--border-primary)
        focus-visible:bg-(--border-primary) focus-visible:outline-none
        active:bg-(--border-primary)
      "
      @pointerdown="onResizeStart"
      @keydown="onResizeKeyDown"
    />
    <!-- eslint-enable vuejs-accessibility/no-static-element-interactions -->

    <slot />
  </Motion>
</template>
