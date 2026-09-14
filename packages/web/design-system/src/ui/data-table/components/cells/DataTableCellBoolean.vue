<script setup lang="ts">
import {
  CheckIcon,
  XCloseIcon,
} from '@wisemen/vue-core-icons'

import DataTableCellEmptyValue from '@/ui/data-table/components/cells/DataTableCellEmptyValue.vue'
import type { DataTableBooleanCell } from '@/ui/data-table/types/dataTableCell.type'

const props = defineProps<DataTableBooleanCell>()
</script>

<template>
  <DataTableCellEmptyValue
    v-if="props.value === null"
    :value="props.fallback"
  />
  <span
    v-else
    class="flex items-center"
  >
    <CheckIcon
      v-if="props.value"
      aria-hidden="true"
      class="size-4 shrink-0 text-success-primary"
    />
    <XCloseIcon
      v-else
      aria-hidden="true"
      class="size-4 shrink-0 text-error-primary"
    />

    <span class="sr-only">{{ props.label }}</span>
  </span>
</template>
