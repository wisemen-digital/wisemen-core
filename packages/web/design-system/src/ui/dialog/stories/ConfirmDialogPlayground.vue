<script setup lang="ts">
import Button from '@/ui/button/button/Button.vue'
import type { DialogSize } from '@/ui/dialog/dialog.props'
import DialogContainer from '@/ui/dialog/DialogContainer.vue'
import { useOverlay } from '@/ui/dialog/dialogOverlay.composable'

import ExampleConfirmDialog from './ExampleConfirmDialog.vue'

const props = withDefaults(defineProps<{
  isDestructive?: boolean
  preventClickOutside?: boolean
  preventEsc?: boolean
  size?: DialogSize
}>(), {
  isDestructive: true,
  preventClickOutside: false,
  preventEsc: false,
  size: 'xs',
})

const overlay = useOverlay()
const dialog = overlay.create(ExampleConfirmDialog)
</script>

<template>
  <div>
    <Button
      label="Open confirm dialog"
      @click="dialog.open({
        isDestructive: props.isDestructive,
        size: props.size,
        preventClickOutside: props.preventClickOutside,
        preventEsc: props.preventEsc,
      })"
    />

    <DialogContainer />
  </div>
</template>
