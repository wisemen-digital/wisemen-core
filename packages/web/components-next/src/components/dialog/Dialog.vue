<script setup lang="ts">
import { useAttrs } from 'vue'

import type { DialogProps } from '@/components/dialog/dialog.props'
import DialogContent from '@/components/dialog/parts/DialogContent.vue'
import DialogContentTransition from '@/components/dialog/parts/DialogContentTransition.vue'
import DialogOverlay from '@/components/dialog/parts/DialogOverlay.vue'
import DialogOverlayTransition from '@/components/dialog/parts/DialogOverlayTransition.vue'
import DialogPortal from '@/components/dialog/parts/DialogPortal.vue'
import DialogRoot from '@/components/dialog/parts/DialogRoot.vue'

const props = withDefaults(defineProps<DialogProps>(), {
  id: null,
  teleportTargetId: null,
  testId: null,
  classConfig: null,
  hideOverlay: false,
  mode: 'overlay',
  preventClickOutside: false,
  preventEsc: false,
})

const emit = defineEmits<{
  /**
   * Emitted when the dialog is requested to be closed (e.g., when clicking outside or pressing the Escape key).
   */
  close: []
  /**
   * @internal
   */
  close_: []
}>()

defineSlots<{
  /**
   * Slot for the main content of the dialog.
   */
  default: () => void
}>()

const isOpen = defineModel<boolean>('isOpen', {
  default: false,
})

const attrs = useAttrs()

function onClose(): void {
  // Emit `_close` alongside `@close` to preserve behavior, since catching `@close` can stop event propagation
  // eslint-disable-next-line vue/custom-event-name-casing
  emit('close_')
  emit('close')
}
</script>

<template>
  <!-- eslint-disable vue/custom-event-name-casing -->
  <DialogRoot
    v-bind="props"
    v-model:is-open="isOpen"
    @close="onClose"
  >
    <DialogPortal>
      <DialogOverlay>
        <DialogOverlayTransition />
      </DialogOverlay>

      <DialogContent>
        <DialogContentTransition v-bind="attrs">
          <slot />
        </DialogContentTransition>
      </DialogContent>
    </DialogPortal>
  </DialogRoot>
</template>
