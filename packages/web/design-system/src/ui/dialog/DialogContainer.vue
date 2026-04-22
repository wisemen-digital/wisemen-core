<script setup lang="ts">
import { useOverlay } from '@/ui/dialog/dialogOverlay.composable'

const {
  close,
  overlays,
  unmount,
} = useOverlay()

function onClose(id: symbol, value?: unknown): void {
  close(id, value)
}

function onAfterLeave(id: symbol): void {
  unmount(id)
}
</script>

<template>
  <template
    v-for="overlay of overlays"
    :key="overlay.id"
  >
    <Component
      :is="overlay.component"
      v-if="overlay.isMounted"
      v-bind="overlay.props"
      v-model:is-open="overlay.isOpen"
      @close="(value: unknown) => onClose(overlay.id, value)"
      @after-leave="onAfterLeave(overlay.id)"
    />
  </template>
</template>
