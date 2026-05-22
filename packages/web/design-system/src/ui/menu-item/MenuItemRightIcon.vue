<script setup lang="ts">
import type { MenuItemRightConfig } from '@/ui/menu-item/menuItem.type'

defineProps<{
  right: Extract<MenuItemRightConfig, { type: 'icon' }>
}>()
</script>

<template>
  <Component
    :is="right.icon"
    class="size-3.5 text-disabled"
  />
</template>
