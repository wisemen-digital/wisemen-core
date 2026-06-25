<script setup lang="ts">
import type { RouteLocationRaw } from 'vue-router'
import { RouterLink } from 'vue-router'

import ClickableElement from '@/ui/clickable-element/ClickableElement.vue'
import { useMainSidebar } from '@/ui/sidebar/mainSidebar.composable'

const props = defineProps<{
  label: string
  noIndent?: boolean
  to: RouteLocationRaw
}>()

const emit = defineEmits<{
  click: []
}>()

const {
  closeIfFloatingSidebar, sidebarIconCellSize,
} = useMainSidebar()

const VERTICAL_LINE_WIDTH = '1px'
const VERTICAL_LINE_GAP = '0.25rem' // pl-xs on the container
const subItemPaddingLeft = `calc(${sidebarIconCellSize} / 2 - ${VERTICAL_LINE_GAP} - ${VERTICAL_LINE_WIDTH})`

function onClick(): void {
  closeIfFloatingSidebar()
  emit('click')
}
</script>

<template>
  <ClickableElement>
    <RouterLink
      v-slot="{ isActive }"
      :to="props.to"
      class="w-full"
      @click="onClick"
    >
      <div
        :data-active="isActive || undefined"
        :style="{
          paddingLeft: props.noIndent ? undefined : subItemPaddingLeft,
          height: '1.5rem',
        }"
        :class="props.noIndent ? 'px-sm' : 'pr-md'"
        class="
          group flex items-center rounded-md duration-100
          hover:bg-fg-primary/4
          data-active:bg-fg-primary/4
        "
      >
        <span
          class="
            truncate text-xs whitespace-nowrap text-tertiary duration-100
            group-hover:text-primary
            group-data-active:text-brand-secondary
          "
        >
          {{ props.label }}
        </span>
      </div>
    </RouterLink>
  </ClickableElement>
</template>
