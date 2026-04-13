<script setup lang="ts">
import { AnimatePresence } from 'motion-v'
import { TooltipContent as RekaTooltipContent } from 'reka-ui'

import { mergeClasses } from '@/class-variant/customClassVariants'
import TestIdProvider from '@/components/shared/TestIdProvider.vue'
import ThemeProvider from '@/components/theme-provider/ThemeProvider.vue'
import { useInjectTooltipContext } from '@/components/tooltip/tooltip.context'

const {
  testId,
  isOpen,
  classConfig,
  customClassConfig,
  popoverAlign,
  popoverAlignOffset,
  popoverCollisionPadding,
  popoverContainerElement,
  popoverSide,
  popoverSideOffset,
  popoverWidth,
  style,
} = useInjectTooltipContext()
</script>

<template>
  <AnimatePresence>
    <TestIdProvider
      v-if="isOpen"
      :test-id="testId"
    >
      <ThemeProvider>
        <RekaTooltipContent
          :force-mount="true"
          :as-child="true"
          :data-content-width="popoverWidth"
          :align="popoverAlign"
          :align-offset="popoverAlignOffset"
          :collision-padding="popoverCollisionPadding"
          :collision-boundary="popoverContainerElement"
          :side="popoverSide"
          :side-offset="popoverSideOffset"
          :class="style.content({
            class: mergeClasses(customClassConfig?.content, classConfig?.content),
          })"
          position-strategy="absolute"
          sticky="always"
        >
          <slot />
        </RekaTooltipContent>
      </ThemeProvider>
    </TestIdProvider>
  </AnimatePresence>
</template>
