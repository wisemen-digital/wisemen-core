<script setup lang="ts">
import { computed } from 'vue'

import { createMenuItemStyle } from '@/ui/menu-item/menuItem.style'
import type { MenuItemLeftConfig } from '@/ui/menu-item/menuItem.type'

const props = defineProps<{
  hasBlockDescription: boolean
  left: Extract<MenuItemLeftConfig, { type: 'icon' }>
  size: 'md' | 'sm'
}>()

const style = computed(() => createMenuItemStyle({
  hasBlockDescription: props.hasBlockDescription,
  hasLeftContent: false,
  hasRightContent: false,
  size: props.size,
}))
</script>

<template>
  <div :class="style.iconWrapper()">
    <Component
      :is="left.icon"
      :class="style.icon()"
    />
  </div>
</template>
