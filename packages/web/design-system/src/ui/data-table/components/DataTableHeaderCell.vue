<script setup lang="ts" generic="TItem">
import type { Header } from '@tanstack/vue-table'
import {
  ArrowNarrowDownIcon,
  ArrowNarrowUpIcon,
  SwitchVertical01Icon,
} from '@wisemen/vue-core-icons'
import type { Component } from 'vue'
import {
  computed,
  useTemplateRef,
} from 'vue'

import type { SortDirection } from '@/composables/sort.composable'
import { useInjectDataTableContext } from '@/ui/data-table/context/dataTable.context'

const props = defineProps<{
  isLastColumnOverall: boolean
  columnKey: string
  header: Header<TItem, unknown>
  label: string
}>()

const {
  leftStickyBorderColumnId,
  leftStickyOffsetPxByColumnId,
  rightStickyBorderColumnId,
  rightStickyOffsetPxByColumnId,
  isColumnResizeDisabled,
  isScrolledFromLeft,
  isScrolledFromRight,
  setColumnSize,
  sort,
} = useInjectDataTableContext()

const cellEl = useTemplateRef<HTMLElement>('cellEl')

// The fill column (last overall, not necessarily sticky-right) is never resizable.
const isResizable = computed<boolean>(
  () => !isColumnResizeDisabled.value && !props.isLastColumnOverall && props.header.column.getCanResize(),
)

const leftOffsetPx = computed<number | null>(() => leftStickyOffsetPxByColumnId.value.get(props.columnKey) ?? null)
const rightOffsetPx = computed<number | null>(() => rightStickyOffsetPxByColumnId.value.get(props.columnKey) ?? null)
const isStickyLeft = computed<boolean>(() => leftOffsetPx.value !== null)
const isStickyRight = computed<boolean>(() => rightOffsetPx.value !== null)
const hasLeftBorder = computed<boolean>(
  () => props.columnKey === leftStickyBorderColumnId.value && isScrolledFromLeft.value,
)
const hasRightBorder = computed<boolean>(
  () => props.columnKey === rightStickyBorderColumnId.value && isScrolledFromRight.value,
)

const isResizing = computed<boolean>(() => props.header.column.getIsResizing())

function onResizeStart(event: MouseEvent | TouchEvent): void {
  // Seeds the real current width before TanStack's own drag math kicks in — otherwise a
  // column's first-ever resize jumps to TanStack's 150px default.
  if (cellEl.value !== null) {
    setColumnSize(props.columnKey, cellEl.value.getBoundingClientRect().width)
  }

  props.header.getResizeHandler()(event)
}

const isSortable = computed<boolean>(() => sort.value?.existsSort(props.columnKey) ?? false)

const sortDirection = computed<SortDirection | null>(() => {
  if (!isSortable.value) {
    return null
  }

  return sort.value?.getSort(props.columnKey)?.direction ?? null
})

const sortIcon = computed<Component | null>(() => {
  if (!isSortable.value) {
    return null
  }

  switch (sortDirection.value) {
    case 'asc':
      return ArrowNarrowUpIcon
    case 'desc':
      return ArrowNarrowDownIcon
    default:
      return SwitchVertical01Icon
  }
})
</script>

<template>
  <div
    ref="cellEl"
    :style="{
      left: isStickyLeft ? `${leftOffsetPx}px` : undefined,
      right: isStickyRight ? `${rightOffsetPx}px` : undefined,
    }"
    :class="{
      'z-30': isStickyLeft || isStickyRight,
      'border-r border-secondary': isStickyLeft && hasLeftBorder,
      'border-l border-secondary': isStickyRight && hasRightBorder,
      'z-40': isResizing,
    }"
    class="
      sticky top-0 z-20 flex h-10 items-center border-b border-secondary
      bg-secondary px-xl transition-[z-index] delay-150 duration-0
      has-[.cursor-col-resize:hover]:z-40 has-[.cursor-col-resize:hover]:delay-0
    "
    role="columnheader"
  >
    <button
      :disabled="!isSortable"
      type="button"
      class="
        -ml-sm flex min-w-0 items-center gap-xs overflow-hidden rounded-sm px-sm
        py-xxs text-xs font-medium text-primary duration-100
        not-disabled:hover:bg-secondary-hover
        disabled:cursor-default!
      "
      @click="sort?.toggleSort(props.columnKey)"
    >
      <span class="truncate">{{ props.label }}</span>

      <Component
        :is="sortIcon"
        v-if="sortIcon !== null"
        :class="sortDirection !== null ? 'text-primary' : 'text-disabled'"
        class="size-3 shrink-0"
      />
    </button>

    <!-- eslint-disable-next-line vuejs-accessibility/no-static-element-interactions -->
    <div
      v-if="isResizable"
      class="
        group/handle absolute top-0 right-0 z-20 flex h-full w-4 translate-x-1/2
        cursor-col-resize items-center justify-center select-none
      "
      @mousedown.prevent="onResizeStart"
      @touchstart.prevent="onResizeStart"
    >
      <div
        :class="{
          'scale-92': isResizing,
        }"
        class="
          h-5 w-1 rounded-full bg-fg-disabled opacity-0 duration-150
          group-hover/handle:opacity-100
        "
      />
    </div>
  </div>
</template>
