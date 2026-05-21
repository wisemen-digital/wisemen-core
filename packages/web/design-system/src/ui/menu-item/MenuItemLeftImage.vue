<script setup lang="ts">
import { computed } from 'vue'

import { createMenuItemStyle } from '@/ui/menu-item/menuItem.style'
import type { MenuItemLeftConfig } from '@/ui/menu-item/menuItem.type'

const props = defineProps<{
  hasBlockDescription: boolean
  alt: string
  left: Extract<MenuItemLeftConfig, { type: 'image' }>
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
    <img
      :alt="alt"
      :src="left.src"
      :class="{
        'w-3.5': left.aspect === undefined || left.aspect === 'square',
        'h-3.5 w-5': left.aspect === 'rectangle',
      }"
      class="rounded-xxs object-contain"
    >
  </div>
</template>
