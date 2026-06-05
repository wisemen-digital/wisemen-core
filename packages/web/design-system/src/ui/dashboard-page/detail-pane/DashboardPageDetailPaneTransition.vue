<script setup lang="ts">
import { Motion } from 'motion-v'
import { computed } from 'vue'
import { useI18n } from 'vue-i18n'

import { useIsReducedMotion } from '@/composables/useIsReducedMotion.composable'
import { useInjectDetailPaneContext } from '@/ui/dashboard-page/detail-pane/detailPane.context'
import type { DetailPaneStyle } from '@/ui/dashboard-page/detail-pane/detailPane.style'
import { createDetailPaneStyle } from '@/ui/dashboard-page/detail-pane/detailPane.style'

const {
  isResizable,
  isResizing,
  sidebarWidth,
  variant,
  onResizeKeyDown,
  onResizeStart,
} = useInjectDetailPaneContext()

const isReduceMotionEnabledOnDevice = useIsReducedMotion()

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
      translateX: '105%',
    }"
    :animate="{
      translateX: '0%',
    }"
    :exit="{
      translateX: '105%',
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
