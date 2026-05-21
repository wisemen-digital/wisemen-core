<script setup lang="ts">
import KeyboardShortcut from '@/ui/keyboard-shortcut/KeyboardShortcut.vue'
import type { MenuItemRightConfig } from '@/ui/menu-item/menuItem.type'

defineProps<{
  right: Extract<MenuItemRightConfig, { type: 'shortcut' }>
}>()
</script>

<template>
  <KeyboardShortcut
    :keyboard-shortcut="right.keyboardShortcut"
    class="ml-sm"
  />
</template>
