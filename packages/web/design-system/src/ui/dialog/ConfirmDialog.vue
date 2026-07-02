<script setup lang="ts">
import { ref } from 'vue'
import { useI18n } from 'vue-i18n'

import type { ConfirmDialogProps } from '@/ui/dialog/confirmDialog.props'
import Dialog from '@/ui/dialog/Dialog.vue'
import DialogFooter from '@/ui/dialog/DialogFooter.vue'
import DialogFooterCancel from '@/ui/dialog/DialogFooterCancel.vue'
import DialogFooterPrimary from '@/ui/dialog/DialogFooterPrimary.vue'
import DialogHeader from '@/ui/dialog/DialogHeader.vue'

const props = withDefaults(defineProps<ConfirmDialogProps>(), {
  isClickOutsideDisabled: false,
  isDestructive: false,
  isEscDisabled: false,
  cancelLabel: null,
  confirmLabel: null,
  icon: null,
})

const emit = defineEmits<{
  close: []
}>()

const i18n = useI18n()

const isLoading = ref<boolean>(false)

async function onConfirmClick(): Promise<void> {
  isLoading.value = true

  try {
    await props.onConfirm()
  }
  finally {
    isLoading.value = false
  }
}

function onCancelClick(): void {
  emit('close')
}

function onClose(): void {
  emit('close')
}
</script>

<template>
  <Dialog
    :has-close-button="false"
    :is-click-outside-disabled="props.isClickOutsideDisabled"
    :is-esc-disabled="props.isEscDisabled"
    :prevent-click-outside="props.preventClickOutside"
    :prevent-esc="props.preventEsc"
    size="xxs"
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
          :is-disabled="isLoading"
          @click="onCancelClick"
        />

        <DialogFooterPrimary
          :label="props.confirmLabel ?? i18n.t('component.unsaved_changes_dialog.confirm')"
          :is-loading="isLoading"
          :is-destructive="props.isDestructive"
          @click="onConfirmClick"
        />
      </template>
    </DialogFooter>
  </Dialog>
</template>
