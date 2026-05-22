<script setup lang="ts">
import { computed } from 'vue'

import { UIAvatar } from '@/ui/avatar'
import { createMenuItemStyle } from '@/ui/menu-item/menuItem.style'
import type { MenuItemLeftConfig } from '@/ui/menu-item/menuItem.type'

const props = defineProps<{
  hasBlockDescription: boolean
  left: Extract<MenuItemLeftConfig, { type: 'avatar' }>
}>()

const style = computed(() => createMenuItemStyle({
  hasBlockDescription: props.hasBlockDescription,
  hasLeftContent: false,
  hasRightContent: false,
  size: 'md',
}))
</script>

<template>
  <UIAvatar
    :name="left.name"
    :src="left.src"
    :image-alt="left.imageAlt"
    :size="hasBlockDescription ? 'sm' : 'xs'"
    :class="style.leftAvatar()"
  />
</template>
