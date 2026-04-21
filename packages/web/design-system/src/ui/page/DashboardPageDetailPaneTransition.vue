<script setup lang="ts">
import {
  Motion,
  useReducedMotion,
} from 'motion-v'
import { computed } from 'vue'

import { useInjectDetailPaneContext } from '@/ui/page/detailPane.context'
import type { DetailPaneStyle } from '@/ui/page/detailPane.style'
import { createDetailPaneStyle } from '@/ui/page/detailPane.style'

const {
  isResizable,
  isResizing,
  sidebarWidth,
  variant,
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

const detailPaneStyle = computed<DetailPaneStyle>(() => createDetailPaneStyle({
  variant,
}))
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
    :class="detailPaneStyle.pane()"
  >
    <!-- eslint-disable vuejs-accessibility/no-static-element-interactions -->
    <div
      v-if="isResizable"
      :class="detailPaneStyle.resizeHandle()"
      role="separator"
      aria-orientation="vertical"
      aria-label="Resize detail pane"
      tabindex="0"
      class="
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
