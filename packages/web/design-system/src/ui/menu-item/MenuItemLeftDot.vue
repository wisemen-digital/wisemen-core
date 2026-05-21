<script setup lang="ts">
import { computed } from 'vue'

import { UIDot } from '@/ui/dot'
import { createMenuItemStyle } from '@/ui/menu-item/menuItem.style'
import type { MenuItemLeftConfig } from '@/ui/menu-item/menuItem.type'

const props = defineProps<{
  hasBlockDescription: boolean
  left: Extract<MenuItemLeftConfig, { type: 'dot' }>
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
  <div :class="style.dotWrapper()">
    <UIDot :color="left.color ?? 'gray'" />
  </div>
</template>
