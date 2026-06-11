<script setup lang="ts">
import Button from '@/ui/button/button/Button.vue'
import { useOverlay } from '@/ui/dialog/dialogOverlay.composable'

import ExampleFormDialog from './ExampleFormDialog.vue'

const props = withDefaults(defineProps<{
  disableUnsavedChangesChin?: boolean
  showExternalChin?: boolean
  unsavedChangesChinText?: string | null
}>(), {
  disableUnsavedChangesChin: false,
  showExternalChin: false,
  unsavedChangesChinText: null,
})

const overlay = useOverlay()
const dialog = overlay.create(ExampleFormDialog)
</script>

<template>
  <div>
    <Button
      label="Open form dialog"
      @click="dialog.open({
        disableUnsavedChangesChin: props.disableUnsavedChangesChin,
        showExternalChin: props.showExternalChin,
        unsavedChangesChinText: props.unsavedChangesChinText,
      })"
    />
  </div>
</template>
