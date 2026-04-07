<script setup lang="ts">
import { ref } from 'vue'

import Button from '@/ui/button/button/Button.vue'
import type { ConfirmDialogProps } from '@/ui/dialog/confirmDialog.props'
import Dialog from '@/ui/dialog/Dialog.vue'
import DialogFooter from '@/ui/dialog/DialogFooter.vue'
import DialogFooterCancel from '@/ui/dialog/DialogFooterCancel.vue'
import DialogHeader from '@/ui/dialog/DialogHeader.vue'

const props = withDefaults(defineProps<ConfirmDialogProps>(), {
  isConfirmDisabled: false,
  isDestructive: false,
  cancelLabel: 'Cancel',
  confirmLabel: 'Confirm',
  icon: null,
  preventClickOutside: false,
  preventEsc: false,
  size: 'xs',
  onClose: null,
  onConfirm: null,
})

const isLoading = ref<boolean>(false)

async function onConfirmClick(): Promise<void> {
  if (props.onConfirm === null) {
    return
  }

  const result = props.onConfirm()

  if (result instanceof Promise) {
    isLoading.value = true

    try {
      await result
    }
    finally {
      isLoading.value = false
    }
  }
}

function onCancelClick(): void {
  props.onClose?.()
}

function onClose(): void {
  props.onClose?.()
}
</script>

<template>
  <Dialog
    :has-close-button="false"
    :size="props.size"
    :prevent-click-outside="props.preventClickOutside"
    :prevent-esc="props.preventEsc"
    @close="onClose"
  >
    <DialogHeader
      :title="props.title"
      :description="props.description"
      :icon="props.icon"
      :icon-variant="props.isDestructive ? 'error' : 'brand'"
      :has-close-button="false"
    />

    <DialogFooter>
      <template #right>
        <DialogFooterCancel
          :label="props.cancelLabel"
          @click="onCancelClick"
        />
        <Button
          :label="props.confirmLabel"
          :is-loading="isLoading"
          :is-disabled="props.isConfirmDisabled"
          :variant="props.isDestructive ? 'destructive-primary' : 'primary'"
          @click="onConfirmClick"
        />
      </template>
    </DialogFooter>
  </Dialog>
</template>
