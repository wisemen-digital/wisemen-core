<script setup lang="ts">
import { ref } from 'vue'
import { useI18n } from 'vue-i18n'

import Button from '@/ui/button/button/Button.vue'
import type { ConfirmDialogProps } from '@/ui/dialog/confirmDialog.props'
import Dialog from '@/ui/dialog/Dialog.vue'
import DialogFooter from '@/ui/dialog/DialogFooter.vue'
import DialogFooterCancel from '@/ui/dialog/DialogFooterCancel.vue'
import DialogHeader from '@/ui/dialog/DialogHeader.vue'

const props = withDefaults(defineProps<ConfirmDialogProps>(), {
  isDestructive: false,
  cancelLabel: null,
  confirmLabel: null,
  icon: null,
  preventClickOutside: false,
  preventEsc: false,
  size: 'xs',
  onClose: null,
  onConfirm: null,
})

const i18n = useI18n()

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
          :label="props.cancelLabel ?? i18n.t('component.unsaved_changes_dialog.cancel')"
          @click="onCancelClick"
        />
        <Button
          :label="props.confirmLabel ?? i18n.t('component.unsaved_changes_dialog.confirm')"
          :is-loading="isLoading"
          :variant="props.isDestructive ? 'destructive-primary' : 'primary'"
          @click="onConfirmClick"
        />
      </template>
    </DialogFooter>
  </Dialog>
</template>
