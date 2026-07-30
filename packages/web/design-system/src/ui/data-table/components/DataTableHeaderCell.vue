<script setup lang="ts">
import {
  ArrowNarrowDownIcon,
  ArrowNarrowUpIcon,
  SwitchVertical01Icon,
} from '@wisemen/vue-core-icons'
import type { Component } from 'vue'
import { computed } from 'vue'

import type { SortDirection } from '@/composables/sort.composable'
import { useInjectDataTableContext } from '@/ui/data-table/context/dataTable.context'

const props = defineProps<{
  isFirstColumn: boolean
  isLastColumn: boolean
  columnKey: string
  label: string
}>()

const {
  isFirstColumnSticky,
  isLastColumnSticky,
  sort,
} = useInjectDataTableContext()

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
    :class="{
      'sticky left-0 z-2 border-r border-secondary': props.isFirstColumn && isFirstColumnSticky,
      'sticky right-0 z-2 border-l border-secondary': props.isLastColumn && isLastColumnSticky,
    }"
    class="flex h-10 items-center overflow-hidden bg-secondary px-xl"
    role="columnheader"
  >
    <button
      :disabled="!isSortable"
      type="button"
      class="
        -ml-sm flex items-center gap-xs rounded-sm px-sm py-xxs text-xs
        font-medium text-primary duration-100
        not-disabled:hover:bg-secondary-hover
        disabled:cursor-default!
      "
      @click="sort?.toggleSort(props.columnKey)"
    >
      {{ props.label }}

      <Component
        :is="sortIcon"
        v-if="sortIcon !== null"
        :class="sortDirection !== null ? 'text-primary' : 'text-disabled'"
        class="size-3"
      />
    </button>
  </div>
</template>
