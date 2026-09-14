<script setup lang="ts">
import { computed } from 'vue'

import DataTableCellEmptyValue from '@/ui/data-table/components/cells/DataTableCellEmptyValue.vue'
import type { DataTableTextCell } from '@/ui/data-table/types/dataTableCell.type'

const props = defineProps<DataTableTextCell>()

const isEmpty = computed<boolean>(() => props.value === null)
</script>

<template>
  <DataTableCellEmptyValue
    v-if="isEmpty"
    :value="props.fallback"
  />
  <span
    v-else
    class="truncate text-xs text-primary"
  >
    {{ props.value }}
  </span>
</template>
