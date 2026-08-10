<script setup lang="ts">
import { computed } from 'vue'

import { useInjectDataTableContext } from '@/ui/data-table/context/dataTable.context'

const props = withDefaults(defineProps<{
  columnId?: string | null
}>(), {
  columnId: null,
})

const {
  leftStickyBorderColumnId,
  leftStickyOffsetPxByColumnId,
  rightStickyBorderColumnId,
  rightStickyOffsetPxByColumnId,
} = useInjectDataTableContext()

const leftOffsetPx = computed<number | null>(
  () => (props.columnId === null ? null : leftStickyOffsetPxByColumnId.value.get(props.columnId) ?? null),
)
const rightOffsetPx = computed<number | null>(
  () => (props.columnId === null ? null : rightStickyOffsetPxByColumnId.value.get(props.columnId) ?? null),
)

const isStickyLeft = computed<boolean>(() => leftOffsetPx.value !== null)
const isStickyRight = computed<boolean>(() => rightOffsetPx.value !== null)
const hasLeftBorder = computed<boolean>(() => props.columnId !== null && props.columnId === leftStickyBorderColumnId.value)
const hasRightBorder = computed<boolean>(() => props.columnId !== null && props.columnId === rightStickyBorderColumnId.value)
</script>

<template>
  <div
    :style="{
      left: isStickyLeft ? `${leftOffsetPx}px` : undefined,
      right: isStickyRight ? `${rightOffsetPx}px` : undefined,
    }"
    :class="{
      'sticky z-1 border-r border-secondary': isStickyLeft && hasLeftBorder,
      'sticky z-1': isStickyLeft && !hasLeftBorder,
      'sticky z-1 border-l border-secondary': isStickyRight && hasRightBorder,
    }"
    class="
      flex h-10 items-center overflow-hidden bg-primary px-xl text-xs
      text-primary
    "
    role="cell"
  >
    <slot />
  </div>
</template>
