<script setup lang="ts">
import { AnimatePresence } from 'motion-v'
import { DropdownMenuContent as RekaDropdownMenuContent } from 'reka-ui'

import { mergeClasses } from '@/class-variant/customClassVariants'
import { useInjectDropdownMenuContext } from '@/components/dropdown-menu/dropdownMenu.context'
import ThemeProvider from '@/components/theme-provider/ThemeProvider.vue'

const {
  isOpen,
  classConfig,
  customClassConfig,
  popoverAlign,
  popoverAlignOffset,
  popoverAnchorReferenceElement,
  popoverCollisionPadding,
  popoverContainerElement,
  popoverSide,
  popoverSideOffset,
  popoverWidth,
  style,
  onCloseAutoFocus,
  onEscapeKeyDown,
} = useInjectDropdownMenuContext()
</script>

<template>
  <AnimatePresence>
    <ThemeProvider v-if="isOpen">
      <RekaDropdownMenuContent
        :force-mount="true"
        :as-child="true"
        :data-content-width="popoverWidth"
        :align="popoverAlign"
        :reference="popoverAnchorReferenceElement ?? undefined"
        :align-offset="popoverAlignOffset"
        :collision-padding="popoverCollisionPadding"
        :collision-boundary="popoverContainerElement"
        :side="popoverSide"
        :side-offset="popoverSideOffset"
        :class="style.content({
          class: mergeClasses(customClassConfig.content, classConfig?.content),
        })"
        position-strategy="absolute"
        sticky="always"
        @close-auto-focus="onCloseAutoFocus"
        @escape-key-down="onEscapeKeyDown"
      >
        <slot />
      </RekaDropdownMenuContent>
    </ThemeProvider>
  </AnimatePresence>
</template>
