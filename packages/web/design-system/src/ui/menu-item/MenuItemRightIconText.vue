<script setup lang="ts">
import type { MenuItemRightConfig } from '@/ui/menu-item/menuItem.type'
import { UIText } from '@/ui/text'

defineProps<{
  right: Extract<MenuItemRightConfig, { type: 'icon-text' }>
}>()
</script>

<template>
  <Component
    :is="right.icon"
    class="size-3.5 shrink-0 text-disabled"
  />
  <UIText
    :text="right.text"
    class="min-w-0 text-xs text-disabled select-none"
  />
</template>
