<script setup lang="ts">
import Badge from '@/ui/badge/Badge.vue'
import DataTableCellEmptyValue from '@/ui/data-table/components/cells/DataTableCellEmptyValue.vue'
import type { DataTableBadgeCell } from '@/ui/data-table/types/dataTableCell.type'

const props = defineProps<DataTableBadgeCell>()
</script>

<template>
  <DataTableCellEmptyValue
    v-if="!props.label"
    :value="props.fallback"
  />
  <Badge
    v-else
    :color="props.color"
    :label="props.label"
    :left="props.left ?? null"
    :rounded="props.rounded"
    :size="props.size ?? 'sm'"
    :variant="props.variant"
  />
</template>
