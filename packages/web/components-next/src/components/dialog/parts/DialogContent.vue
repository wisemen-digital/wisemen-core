<script setup lang="ts">
import { AnimatePresence } from 'motion-v'
import { DialogContent as RekaDialogContent } from 'reka-ui'
import { useAttrs } from 'vue'

import { mergeClasses } from '@/class-variant/customClassVariants'
import { useInjectDialogContext } from '@/components/dialog/dialog.context'
import TestIdProvider from '@/components/shared/TestIdProvider.vue'

defineOptions({
  inheritAttrs: false,
})

defineSlots<{
  /**
   * Slot for the main content of the dialog.
   */
  default: () => void
}>()

const {
  testId,
  isOpen,
  classConfig,
  customClassConfig,
  hideOverlay,
  preventClickOutside,
  preventEsc,
  style,
} = useInjectDialogContext()

const attrs = useAttrs()

function onEscapeKeyDown(event: KeyboardEvent): void {
  if (preventEsc.value) {
    event.preventDefault()
  }
}

function onInteractOutside(event: CustomEvent): void {
  if (preventClickOutside.value) {
    event.preventDefault()
  }

  const target = event.target as HTMLElement
  const isOverlay = target.attributes.getNamedItem('data-dialog-overlay') !== null

  if (!isOverlay) {
    event.preventDefault()
  }
}
</script>

<template>
  <AnimatePresence>
    <TestIdProvider
      v-if="isOpen"
      :test-id="testId"
    >
      <RekaDialogContent
        :as-child="true"
        :force-mount="true"
        :class="style.content({
          class: mergeClasses(customClassConfig.content, classConfig?.content),
        })"
        :trap-focus="!hideOverlay"
        v-bind="attrs"
        @escape-key-down="onEscapeKeyDown"
        @interact-outside="onInteractOutside"
      >
        <slot />
      </RekaDialogContent>
    </TestIdProvider>
  </AnimatePresence>
</template>
