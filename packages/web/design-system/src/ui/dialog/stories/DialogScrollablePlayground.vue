<script setup lang="ts">
import Button from '@/ui/button/button/Button.vue'
import type { DialogSize } from '@/ui/dialog/dialog.props'
import { useOverlay } from '@/ui/dialog/dialogOverlay.composable'

import ExampleScrollableDialog from './ExampleScrollableDialog.vue'

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
const dialog = overlay.create(ExampleScrollableDialog)
</script>

<template>
  <div>
    <Button
      label="Open scrollable dialog"
      @click="dialog.open({
        size: props.size,
        isClickOutsideDisabled: props.isClickOutsideDisabled,
        isEscDisabled: props.isEscDisabled,
      })"
    />
  </div>
</template>
