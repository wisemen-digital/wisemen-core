<script setup lang="ts">
import {
  CheckIcon,
  XCloseIcon,
} from '@wisemen/vue-core-icons'

import type { DataTableBooleanCell } from '@/ui/data-table/types/dataTableCell.type'

defineProps<DataTableBooleanCell>()
</script>

<template>
  <span
    v-if="value !== null"
    class="flex items-center"
  >
    <CheckIcon
      v-if="value"
      aria-hidden="true"
      class="size-4 shrink-0 text-success-primary"
    />
    <XCloseIcon
      v-else
      aria-hidden="true"
      class="size-4 shrink-0 text-error-primary"
    />

    <span class="sr-only">{{ label }}</span>
  </span>
</template>
