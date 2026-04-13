<script setup lang="ts">
import { AnimatePresence } from 'motion-v'
import { DialogOverlay as RekaDialogOverlay } from 'reka-ui'

import { mergeClasses } from '@/class-variant/customClassVariants'
import { useInjectDialogContext } from '@/components/dialog/dialog.context'

const {
  isOpen,
  classConfig,
  customClassConfig,
  hideOverlay,
  style,
} = useInjectDialogContext()
</script>

<template>
  <AnimatePresence>
    <RekaDialogOverlay
      v-if="isOpen && !hideOverlay"
      :as-child="true"
      :force-mount="true"
      :class="style.overlay({
        class: mergeClasses(customClassConfig.overlay, classConfig?.overlay),
      })"
      data-dialog-overlay
    >
      <slot />
    </RekaDialogOverlay>
  </AnimatePresence>
</template>
