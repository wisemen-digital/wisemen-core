<script setup lang="ts">
import { computed } from 'vue'

import { mergeClasses } from '@/class-variant/customClassVariants'
import { VcButton } from '@/components/button/index'
import { useInjectTableContext } from '@/components/table/table.context'
import type { Icon } from '@/icons/icons'

const props = withDefaults(defineProps<{
  isSortable?: boolean
  sortDirection?: 'asc' | 'desc' | null
}>(), {
  isSortable: false,
  sortDirection: null,
})

const emit = defineEmits<{
  sort: []
}>()

const {
  hasReachedHorizontalEnd,
  isFirstColumnSticky,
  isLastColumnSticky,
  isScrolledHorizontally,
  classConfig,
  customClassConfig,
  style,
} = useInjectTableContext()

const icon = computed<Icon | null>(() => {
  if (!props.isSortable) {
    return null
  }

  if (props.sortDirection === 'asc') {
    return 'arrowUp'
  }

  if (props.sortDirection === 'desc') {
    return 'arrowDown'
  }

  return 'switchVertical'
})
</script>

<template>
  <div
    :class="[
      style.headerCell({
        class: mergeClasses(customClassConfig?.headerCell, classConfig?.headerCell),
      }),
      {
        'first:sticky first:left-0 first:z-1 first:border-r': isFirstColumnSticky,
        'last:sticky last:right-0 last:z-1 last:border-l': isLastColumnSticky,
        'first:border-r-secondary': isScrolledHorizontally,
        'first:border-r-transparent': !isScrolledHorizontally,
        'last:border-l-secondary': !hasReachedHorizontalEnd,
        'last:border-l-transparent': hasReachedHorizontalEnd,
      },
    ]"
    role="columnheader"
    class="flex items-center"
  >
    <VcButton
      v-if="props.isSortable"
      :class-config="{
        root: 'p-0 px-0 h-auto !bg-transparent min-w-auto rounded-sm !text-secondary',
        iconRight: props.sortDirection === null ? 'text-disabled' : 'text-secondary',
        ...customClassConfig?.headerCellButton,
        ...classConfig?.headerCellButton,
      }"
      :icon-right="icon"
      variant="tertiary"
      @click="emit('sort')"
    >
      <slot />
    </VcButton>

    <span
      v-else
      :class="style.headerCellLabel({
        class: mergeClasses(customClassConfig?.headerCellLabel, classConfig?.headerCellLabel),
      })"
    >
      <slot />
    </span>
  </div>
</template>
