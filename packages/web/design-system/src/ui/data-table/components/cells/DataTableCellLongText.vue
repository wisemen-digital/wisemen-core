<script setup lang="ts">
import { computed } from 'vue'

import DataTableCellEmptyValue from '@/ui/data-table/components/cells/DataTableCellEmptyValue.vue'
import type { DataTableLongTextCell } from '@/ui/data-table/types/dataTableCell.type'
import { UITooltip } from '@/ui/tooltip'

const props = defineProps<DataTableLongTextCell>()

const isEmpty = computed<boolean>(() => props.value === null)
</script>

<template>
  <DataTableCellEmptyValue
    v-if="isEmpty"
    :value="props.fallback"
  />
  <UITooltip
    v-else
    popover-side="top"
  >
    <template #trigger>
      <span class="pointer-events-auto truncate text-xs text-primary">
        {{ props.value }}
      </span>
    </template>

    <template #content>
      <span class="flex max-w-xs px-sm py-xs text-xs text-secondary">
        {{ props.value }}
      </span>
    </template>
  </UITooltip>
</template>
