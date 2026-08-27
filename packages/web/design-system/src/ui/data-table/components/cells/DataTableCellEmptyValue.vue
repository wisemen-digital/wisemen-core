<script setup lang="ts">
import { DATA_TABLE_CELL_EMPTY_VALUE_FALLBACK } from '@/ui/data-table/utils/dataTable.util'

const props = withDefaults(defineProps<{
  value?: string
}>(), {
  value: DATA_TABLE_CELL_EMPTY_VALUE_FALLBACK,
})
</script>

<template>
  <span class="truncate text-xs text-tertiary">
    {{ props.value }}
  </span>
</template>
