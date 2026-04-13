<script setup lang="ts">
import { defineComponentVariant } from '@/class-variant/customClassVariants'
import KeyboardShortcut from '@/components/keyboard-shortcut/KeyboardShortcut.vue'

defineComponentVariant({
  config: {
    keyboardKey: {
      key: 'scale-400',
    },
  },
  component: 'keyboardShortcut',
})
</script>

<template>
  <Story title="Playground">
    <KeyboardShortcut :keyboard-keys="['meta', ',']" />
  </Story>
</template>
