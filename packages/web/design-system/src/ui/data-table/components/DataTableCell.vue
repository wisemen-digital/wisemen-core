<script setup lang="ts">
import { useInjectDataTableContext } from '@/ui/data-table/context/dataTable.context'

const props = defineProps<{
  isFirstColumn: boolean
  isLastColumn: boolean
}>()

const {
  isFirstColumnSticky, isLastColumnSticky,
} = useInjectDataTableContext()
</script>

<template>
  <div
    :class="{
      'sticky left-0 z-1 border-r border-secondary': props.isFirstColumn && isFirstColumnSticky,
      'sticky right-0 z-1 border-l border-secondary': props.isLastColumn && isLastColumnSticky,
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
