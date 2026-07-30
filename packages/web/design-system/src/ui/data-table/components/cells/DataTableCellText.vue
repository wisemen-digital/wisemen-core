<script setup lang="ts">
import { computed } from 'vue'

import type { DataTableTextCell } from '@/ui/data-table/types/dataTableCell.type'

const props = defineProps<DataTableTextCell>()

const displayValue = computed<string>(() => props.value ?? props.fallback ?? '')
</script>

<template>
  <span class="truncate text-xs text-primary">
    {{ displayValue }}
  </span>
</template>
