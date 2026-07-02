<script setup lang="ts">
import Button from '@/ui/button/button/Button.vue'
import type { DialogSize } from '@/ui/dialog/dialog.props'
import { useOverlay } from '@/ui/dialog/dialogOverlay.composable'

import ExampleDialog from './ExampleDialog.vue'

const props = withDefaults(defineProps<{
  isClickOutsideDisabled?: boolean
  isEscDisabled?: boolean
  size?: DialogSize
}>(), {
  isClickOutsideDisabled: false,
  isEscDisabled: false,
  size: 'md',
})

const overlay = useOverlay()
const dialog = overlay.create(ExampleDialog)
</script>

<template>
  <div class="h-dvh">
    <Button
      label="Open dialog"
      @click="dialog.open({
        size: props.size,
        isClickOutsideDisabled: props.isClickOutsideDisabled,
        isEscDisabled: props.isEscDisabled,
      })"
    />
  </div>
</template>
