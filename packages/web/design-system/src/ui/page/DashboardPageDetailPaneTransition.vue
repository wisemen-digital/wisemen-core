<script setup lang="ts">
import {
  Motion,
  useReducedMotion,
} from 'motion-v'
import { computed } from 'vue'
import { useI18n } from 'vue-i18n'

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

const {
  t,
} = useI18n()

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
      :aria-label="t('component.dashboard_page_detail_pane_transition.resize')"
      role="separator"
      aria-orientation="vertical"
      tabindex="0"
      class="focus-visible:outline-none"
      @pointerdown="onResizeStart"
      @keydown="onResizeKeyDown"
    >
      <div :class="detailPaneStyle.resizeHandleBar()" />
    </div>
    <!-- eslint-enable vuejs-accessibility/no-static-element-interactions -->

    <slot />
  </Motion>
</template>
