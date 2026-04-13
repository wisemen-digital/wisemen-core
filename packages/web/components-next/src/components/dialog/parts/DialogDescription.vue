<script setup lang="ts">
import { DialogDescription } from 'reka-ui'

defineSlots<{
  /**
   * Slot for the description content of the dialog.
   */
  default: () => void
}>()
</script>

<template>
  <DialogDescription :as-child="true">
    <slot />
  </DialogDescription>
</template>
