<script setup lang="ts">
import { Motion } from 'motion-v'
import { computed } from 'vue'

import { useIsReducedMotion } from '@/composables/useIsReducedMotion.composable'
import { useMainContentDetailPane } from '@/ui/layout/mainContentDetailPane.composable'
import { useInjectMainLayoutContext } from '@/ui/layout/mainLayout.context'
import { useMainSidebar } from '@/ui/sidebar/mainSidebar.composable'
import TopBar from '@/ui/top-bar/TopBar.vue'

const {
  isFloatingSidebar,
  isSidebarOpen,
  collapsedVariant,
  sidebarWidth,
} = useMainSidebar()

const isReduceMotionEnabledOnDevice = useIsReducedMotion()

useMainContentDetailPane()

const {
  isBrandedActive: isBranded,
} = useInjectMainLayoutContext()

const contentPaddingLeft = computed<string>(() => {
  if (isFloatingSidebar.value) {
    return '0.5rem'
  }

  if (collapsedVariant.value === 'minified') {
    return sidebarWidth.value
  }

  if (isSidebarOpen.value) {
    return sidebarWidth.value
  }

  return '0.5rem'
})
</script>

<template>
  <Motion
    :initial="{
      paddingLeft: contentPaddingLeft,
    }"
    :animate="{
      paddingLeft: contentPaddingLeft,
    }"
    :transition="{
      duration: isReduceMotionEnabledOnDevice ? 0 : 0.3,
      type: 'spring',
      bounce: 0,
    }"
    :class="isBranded ? null : 'bg-secondary'"
    class="flex size-full flex-col overflow-hidden p-md"
  >
    <div :class="isBranded ? ['default', 'branded'] : null">
      <TopBar>
        <template #actions>
          <slot name="top-bar-actions" />
        </template>
      </TopBar>
    </div>
    <slot />
  </Motion>
</template>
