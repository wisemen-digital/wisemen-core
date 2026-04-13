<script setup lang="ts">
import { DialogTitle } from 'reka-ui'

defineSlots<{
  /**
   * Slot for the title content of the dialog.
   */
  default: () => void
}>()
</script>

<template>
  <DialogTitle :as-child="true">
    <slot />
  </DialogTitle>
</template>
