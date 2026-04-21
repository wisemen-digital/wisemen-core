<script setup lang="ts">
import { CheckCircleIcon } from '@wisemen/vue-core-icons'

import type { DialogSize } from '@/ui/dialog/dialog.props'
import Dialog from '@/ui/dialog/Dialog.vue'
import DialogBody from '@/ui/dialog/DialogBody.vue'
import DialogFooter from '@/ui/dialog/DialogFooter.vue'
import DialogFooterCancel from '@/ui/dialog/DialogFooterCancel.vue'
import DialogFooterPrimary from '@/ui/dialog/DialogFooterPrimary.vue'
import DialogHeader from '@/ui/dialog/DialogHeader.vue'

withDefaults(defineProps<{
  isOpen?: boolean
  preventClickOutside?: boolean
  preventEsc?: boolean
  size?: DialogSize
}>(), {
  isOpen: false,
  preventClickOutside: false,
  preventEsc: false,
  size: 'md',
})

const emit = defineEmits<{
  close: []
}>()

function onClose(): void {
  emit('close')
}
</script>

<template>
  <Dialog
    :is-open="isOpen"
    :size="size"
    :prevent-click-outside="preventClickOutside"
    :prevent-esc="preventEsc"
    @close="$emit('close')"
    @update:is-open="!$event && $emit('close')"
  >
    <DialogHeader
      :icon="CheckCircleIcon"
      title="Scrollable dialog"
      description="This dialog has enough content to scroll. Notice how the separator appears when scrolling."
    />

    <DialogBody>
      <div class="flex flex-col gap-xl">
        <p
          v-for="i in 20"
          :key="i"
          :textContent="`Paragraph ${i} — scroll to see the separator appear and disappear.`"
          class="text-sm text-secondary"
        />
      </div>
    </DialogBody>

    <DialogFooter>
      <template #right>
        <DialogFooterCancel
          label="Cancel"
          @click="onClose"
        />
        <DialogFooterPrimary
          label="Confirm"
          @click="onClose"
        />
      </template>
    </DialogFooter>
  </Dialog>
</template>
