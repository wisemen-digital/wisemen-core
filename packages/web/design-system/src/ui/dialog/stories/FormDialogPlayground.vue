<script setup lang="ts">
import Button from '@/ui/button/button/Button.vue'
import { useOverlay } from '@/ui/dialog/dialogOverlay.composable'

import ExampleFormDialog from './ExampleFormDialog.vue'

const props = withDefaults(defineProps<{
  promptOnUnsavedChanges?: boolean
  showExternalChin?: boolean
  unsavedChangesText?: string | null
}>(), {
  promptOnUnsavedChanges: true,
  showExternalChin: false,
  unsavedChangesText: null,
})

const overlay = useOverlay()
const dialog = overlay.create(ExampleFormDialog)
</script>

<template>
  <div>
    <Button
      label="Open form dialog"
      @click="dialog.open({
        promptOnUnsavedChanges: props.promptOnUnsavedChanges,
        showExternalChin: props.showExternalChin,
        unsavedChangesText: props.unsavedChangesText,
      })"
    />
  </div>
</template>
