<script setup lang="ts">
import { computed } from 'vue'

import type { DataTableLocationCell } from '@/ui/data-table/types/dataTableCell.type'

const props = defineProps<DataTableLocationCell>()

const displayValue = computed<string>(() => {
  if (props.value === null) {
    return ''
  }

  const {
    city,
    country,
    street,
    streetNumber,
  } = props.value

  switch (props.precision) {
    case 'country':
      return country
    case 'municipality':
      return city
    default:
      return [
        street,
        streetNumber,
      ].filter(Boolean).join(' ')
  }
})
</script>

<template>
  <span class="truncate text-xs text-primary">
    {{ displayValue }}
  </span>
</template>
