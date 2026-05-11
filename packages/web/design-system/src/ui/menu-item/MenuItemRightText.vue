<script setup lang="ts">
import { UIText } from '@/ui/text'
import type { MenuItemRightConfig } from '@/ui/menu-item/menuItem.type'

defineProps<{
  right: Extract<MenuItemRightConfig, { type: 'text' }>
}>()
</script>

<template>
  <UIText
    :text="right.text"
    class="min-w-0 text-xs text-disabled select-none"
  />
</template>
