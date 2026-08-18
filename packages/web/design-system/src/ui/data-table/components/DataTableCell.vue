<script setup lang="ts">
import { computed } from 'vue'

import type { RegisteredActionContext } from '@/register'
import DataTableRowClickCatcher from '@/ui/data-table/components/DataTableRowClickCatcher.vue'
import { useInjectDataTableContext } from '@/ui/data-table/context/dataTable.context'
import type { DataTableRowClick } from '@/ui/data-table/types/dataTableRowConfig.type'

const props = withDefaults(defineProps<{
  columnId?: string | null
  model?: RegisteredActionContext['models'][number] | null
  onRowClick?: DataTableRowClick | null
}>(), {
  columnId: null,
  model: null,
  onRowClick: null,
})

const {
  leftStickyBorderColumnId,
  leftStickyOffsetPxByColumnId,
  rightStickyBorderColumnId,
  rightStickyOffsetPxByColumnId,
  isScrolledFromLeft,
  isScrolledFromRight,
} = useInjectDataTableContext()

const leftOffsetPx = computed<number | null>(
  () => (props.columnId === null ? null : leftStickyOffsetPxByColumnId.value.get(props.columnId) ?? null),
)
const rightOffsetPx = computed<number | null>(
  () => (props.columnId === null ? null : rightStickyOffsetPxByColumnId.value.get(props.columnId) ?? null),
)

const isStickyLeft = computed<boolean>(() => leftOffsetPx.value !== null)
const isStickyRight = computed<boolean>(() => rightOffsetPx.value !== null)
const hasLeftBorder = computed<boolean>(() => props.columnId !== null
  && props.columnId === leftStickyBorderColumnId.value
  && isScrolledFromLeft.value)
const hasRightBorder = computed<boolean>(() => props.columnId !== null
  && props.columnId === rightStickyBorderColumnId.value
  && isScrolledFromRight.value)
</script>

<template>
  <div
    :style="{
      left: isStickyLeft ? `${leftOffsetPx}px` : undefined,
      right: isStickyRight ? `${rightOffsetPx}px` : undefined,
    }"
    :class="{
      'sticky z-2': isStickyLeft || isStickyRight,
      'border-r border-secondary': isStickyLeft && hasLeftBorder,
      'border-l border-secondary': isStickyRight && hasRightBorder,
    }"
    class="
      relative flex h-10 items-center overflow-hidden bg-primary px-xl text-xs
      text-primary
      group-hover/row:bg-primary-hover
      group-has-focus-visible/row:bg-primary-hover
    "
    role="cell"
  >
    <!-- Row click catcher, repeated per cell; content below is pointer-events-none so it falls through. -->
    <DataTableRowClickCatcher
      :click="props.onRowClick"
      :model="props.model"
    />

    <div class="pointer-events-none relative z-1 flex size-full items-center">
      <slot />
    </div>
  </div>
</template>
