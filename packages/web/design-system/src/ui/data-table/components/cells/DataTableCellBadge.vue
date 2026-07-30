<script setup lang="ts">
import Badge from '@/ui/badge/Badge.vue'
import type { DataTableBadgeCell } from '@/ui/data-table/types/dataTableCell.type'

defineProps<DataTableBadgeCell>()
</script>

<template>
  <Badge
    :color="color"
    :label="label"
    :left="left ?? null"
    :rounded="rounded"
    :size="size ?? 'sm'"
    :variant="variant"
  />
</template>
