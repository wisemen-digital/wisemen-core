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
  nextTick,
  useTemplateRef,
} from 'vue'

import type { SortDirection } from '@/composables/sort.composable'
import { useInjectDataTableContext } from '@/ui/data-table/context/dataTable.context'

const props = defineProps<{
  isFirstColumn: boolean
  isLastColumn: boolean
  columnKey: string
  header: Header<TItem, unknown>
  label: string
}>()

const {
  isColumnResizeDisabled,
  isFirstColumnSticky,
  isLastColumnSticky,
  setColumnSize,
  sort,
} = useInjectDataTableContext()

const cellEl = useTemplateRef<HTMLElement>('cellEl')

// The last column is never resizable, even if `header.column.getCanResize()` says otherwise —
// it always stays the fluid fill column (`FILL_SPACE_COLUMN`), so DataTable never overflows its
// container from a resize alone. See `CONTEXT.md` ("Column resize").
const isResizable = computed<boolean>(
  () => !isColumnResizeDisabled.value && !props.isLastColumn && props.header.column.getCanResize(),
)

const isResizing = computed<boolean>(() => props.header.column.getIsResizing())

function onResizeStart(event: MouseEvent | TouchEvent): void {
  // TanStack's own `header.getSize()` (what `getResizeHandler()` captures internally as the
  // drag's starting size) falls back to `defaultColumnSizing.size` (150px) for any column with
  // no `columnSizing` entry yet — unrelated to this column's actual fluid CSS-rendered width.
  // Without seeding the real width first, a column's very first resize jumps to ~150px on the
  // first pixel of drag, before snapping back to tracking the cursor correctly. Every later
  // resize of the same column is unaffected, since `columnSizing` already holds a real value
  // by then. See `CONTEXT.md` ("Column resize — first-drag jump").
  if (cellEl.value !== null) {
    setColumnSize(props.columnKey, cellEl.value.getBoundingClientRect().width)
  }

  props.header.getResizeHandler()(event)
}

// No TanStack equivalent — render at natural (`max-content`) width, measure it, feed that
// number back in as a fixed size. Same "measure DOM, feed back as a fixed size" shape as the
// current `Table`'s `fitColumnToContent`.
async function onResizeFitToContent(): Promise<void> {
  const el = cellEl.value

  if (el === null) {
    return
  }

  const previousWidth = el.style.width

  el.style.width = 'max-content'
  await nextTick()

  const measuredWidth = el.getBoundingClientRect().width

  el.style.width = previousWidth

  setColumnSize(props.columnKey, measuredWidth)
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
    :class="{
      'left-0 z-30 border-r border-secondary': props.isFirstColumn && isFirstColumnSticky,
      'right-0 z-30 border-l border-secondary': props.isLastColumn && isLastColumnSticky,
      'z-40': isResizing,
    }"
    class="
      sticky top-0 z-20 flex h-10 items-center border-b border-secondary
      bg-secondary px-xl
      has-[.cursor-col-resize:hover]:z-40
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
      @dblclick.prevent="onResizeFitToContent"
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
