<script setup lang="ts">
import { computed } from 'vue'

import type { DataTableLongTextCell } from '@/ui/data-table/types/dataTableCell.type'
import { UITooltip } from '@/ui/tooltip'

const props = defineProps<DataTableLongTextCell>()

const displayValue = computed<string>(() => props.value ?? props.fallback ?? '')
</script>

<template>
  <UITooltip
    v-if="displayValue !== ''"
    popover-side="top"
  >
    <template #trigger>
      <span class="pointer-events-auto truncate text-xs text-primary">
        {{ displayValue }}
      </span>
    </template>

    <template #content>
      <span class="flex max-w-xs px-sm py-xs text-xs text-secondary">
        {{ displayValue }}
      </span>
    </template>
  </UITooltip>
</template>
