<script setup lang="ts">
import { computed } from 'vue'

import DataTableCellEmptyValue from '@/ui/data-table/components/cells/DataTableCellEmptyValue.vue'
import type { DataTableIdCell } from '@/ui/data-table/types/dataTableCell.type'

const props = defineProps<DataTableIdCell>()

const displayValue = computed<string | null>(() => {
  if (props.value === null) {
    return null
  }

  if (props.maxLength === undefined || props.value.length <= props.maxLength) {
    return props.value
  }

  return `${props.value.slice(0, props.maxLength)}…`
})
</script>

<template>
  <DataTableCellEmptyValue
    v-if="displayValue === null"
    :value="props.fallback"
  />
  <span
    v-else
    :title="props.value ?? undefined"
    class="truncate font-mono text-xs text-primary"
  >
    {{ displayValue }}
  </span>
</template>
