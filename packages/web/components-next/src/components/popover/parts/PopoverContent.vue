<script setup lang="ts">
import { AnimatePresence } from 'motion-v'
import { PopoverContent as RekaPopoverContent } from 'reka-ui'

import { mergeClasses } from '@/class-variant/customClassVariants'
import { useInjectPopoverContext } from '@/components/popover/popover.context'
import TestIdProvider from '@/components/shared/TestIdProvider.vue'
import ThemeProvider from '@/components/theme-provider/ThemeProvider.vue'

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
  onAutoFocusOnClose,
  onContentEscapeKeyDown,
  onContentFocusOutside,
  onContentInteractOutside,
} = useInjectPopoverContext()
</script>

<template>
  <AnimatePresence>
    <TestIdProvider
      v-if="isOpen"
      :test-id="testId"
    >
      <ThemeProvider :as-child="true">
        <RekaPopoverContent
          :force-mount="true"
          :as-child="true"
          :data-content-width="popoverWidth"
          :align="popoverAlign"
          :collision-padding="popoverCollisionPadding"
          :collision-boundary="popoverContainerElement"
          :align-offset="popoverAlignOffset"
          :side="popoverSide"
          :side-offset="popoverSideOffset"
          :class="style.content({
            class: mergeClasses(customClassConfig.content, classConfig?.content),
          })"
          position-strategy="absolute"
          sticky="always"
          @escape-key-down="onContentEscapeKeyDown"
          @focus-outside="onContentFocusOutside"
          @interact-outside="onContentInteractOutside"
          @close-auto-focus="onAutoFocusOnClose"
        >
          <slot />
        </RekaPopoverContent>
      </ThemeProvider>
    </TestIdProvider>
  </AnimatePresence>
</template>
