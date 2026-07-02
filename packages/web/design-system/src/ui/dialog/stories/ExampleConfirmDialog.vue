<script setup lang="ts">
import { Trash01Icon } from '@wisemen/vue-core-icons'

import ConfirmDialog from '@/ui/dialog/ConfirmDialog.vue'
import type { DialogSize } from '@/ui/dialog/dialog.props'

withDefaults(defineProps<{
  isDestructive?: boolean
  isOpen?: boolean
  isClickOutsideDisabled?: boolean
  isEscDisabled?: boolean
  size?: DialogSize
}>(), {
  isDestructive: true,
  isClickOutsideDisabled: false,
  isEscDisabled: false,
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
    :is-click-outside-disabled="isClickOutsideDisabled"
    :is-esc-disabled="isEscDisabled"
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
