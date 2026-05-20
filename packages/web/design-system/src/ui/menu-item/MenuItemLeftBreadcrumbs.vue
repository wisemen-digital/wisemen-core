<script setup lang="ts">
import { ChevronRightIcon } from '@wisemen/vue-core-icons'

import type { MenuItemLeftConfig } from '@/ui/menu-item/menuItem.type'
import { UIRowLayout } from '@/ui/row-layout'
import { UIText } from '@/ui/text'

const props = defineProps<{
  left: Extract<MenuItemLeftConfig, { type: 'breadcrumbs' }>
}>()
</script>

<template>
  <UIRowLayout
    gap="sm"
    class="flex max-w-full overflow-hidden whitespace-nowrap"
  >
    <template
      v-for="(breadcrumb, index) in props.left.breadcrumbs"
      :key="index"
    >
      <Component
        :is="breadcrumb.icon"
        v-if="breadcrumb.icon !== undefined"
        class="size-3 shrink-0 text-disabled"
      />
      <UIText
        :text="breadcrumb.label"
        class="text-sm text-disabled select-none"
      />
      <ChevronRightIcon class="size-3 shrink-0 text-disabled" />
    </template>
  </UIRowLayout>
</template>
