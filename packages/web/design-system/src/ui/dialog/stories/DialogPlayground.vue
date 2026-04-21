<script setup lang="ts">
import Button from '@/ui/button/button/Button.vue'
import type { DialogSize } from '@/ui/dialog/dialog.props'
import DialogContainer from '@/ui/dialog/DialogContainer.vue'
import { useOverlay } from '@/ui/dialog/dialogOverlay.composable'

import ExampleDialog from './ExampleDialog.vue'

const props = withDefaults(defineProps<{
  preventClickOutside?: boolean
  preventEsc?: boolean
  size?: DialogSize
}>(), {
  preventClickOutside: false,
  preventEsc: false,
  size: 'md',
})

const overlay = useOverlay()
const dialog = overlay.create(ExampleDialog)
</script>

<template>
  <div>
    <Button
      label="Open dialog"
      @click="dialog.open({
        size: props.size,
        preventClickOutside: props.preventClickOutside,
        preventEsc: props.preventEsc,
      })"
    />

    <DialogContainer />
  </div>
</template>
