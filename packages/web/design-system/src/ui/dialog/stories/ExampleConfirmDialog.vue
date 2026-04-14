<script setup lang="ts">
import { Trash01Icon } from '@wisemen/vue-core-icons'

import ConfirmDialog from '@/ui/dialog/ConfirmDialog.vue'
import type { DialogSize } from '@/ui/dialog/dialog.props'

withDefaults(defineProps<{
  isDestructive?: boolean
  isOpen?: boolean
  preventClickOutside?: boolean
  preventEsc?: boolean
  size?: DialogSize
}>(), {
  isDestructive: true,
  preventClickOutside: false,
  preventEsc: false,
  size: 'xs',
})

const emit = defineEmits<{
  close: []
}>()

function onConfirm(): void {
  emit('close')
}

function onCancel(): void {
  emit('close')
}
</script>

<template>
  <ConfirmDialog
    :is-open="isOpen"
    :is-destructive="isDestructive"
    :size="size"
    :prevent-click-outside="preventClickOutside"
    :prevent-esc="preventEsc"
    :icon="Trash01Icon"
    title="Delete item"
    description="Are you sure you want to delete this item? This action cannot be undone."
    confirm-label="Delete"
    cancel-label="Cancel"
    @confirm="onConfirm"
    @cancel="onCancel"
    @close="emit('close')"
  />
</template>
