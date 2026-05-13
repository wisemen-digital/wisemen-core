<script setup lang="ts">
import {
  Motion,
  useReducedMotion,
} from 'motion-v'
import { computed } from 'vue'

import { useMainSidebar } from '@/ui/sidebar/mainSidebar.composable'

const {
  isFloatingSidebar,
  isSidebarOpen,
  collapsedVariant,
  sidebarWidth,
} = useMainSidebar()

const isReduceMotionEnabledOnDevice = useReducedMotion()

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
    class="flex size-full flex-col overflow-hidden bg-secondary p-md"
  >
    <slot />
  </Motion>
</template>
