<script setup lang="ts">
import Button from '@/ui/button/button/Button.vue'
import type { DialogSize } from '@/ui/dialog/dialog.props'
import { useOverlay } from '@/ui/dialog/dialogOverlay.composable'

import ExampleConfirmDialog from './ExampleConfirmDialog.vue'

const props = withDefaults(defineProps<{
  isDestructive?: boolean
  isClickOutsideDisabled?: boolean
  isEscDisabled?: boolean
  size?: DialogSize
}>(), {
  isDestructive: true,
  isClickOutsideDisabled: false,
  isEscDisabled: false,
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
        isClickOutsideDisabled: props.isClickOutsideDisabled,
        isEscDisabled: props.isEscDisabled,
      })"
    />
  </div>
</template>
