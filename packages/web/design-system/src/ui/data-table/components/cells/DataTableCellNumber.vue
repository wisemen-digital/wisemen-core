<script setup lang="ts">
import { computed } from 'vue'

import { getLocaleFromNumberFormat } from '@/types/numberFormat.type'
import { useInjectConfigContext } from '@/ui/config-provider/config.context'
import DataTableCellEmptyValue from '@/ui/data-table/components/cells/DataTableCellEmptyValue.vue'
import type { DataTableNumberCell } from '@/ui/data-table/types/dataTableCell.type'

const props = defineProps<DataTableNumberCell>()

const configContext = useInjectConfigContext()

const effectiveLocale = computed<string>(() => getLocaleFromNumberFormat(configContext.numberFormat.value))

const displayValue = computed<string | null>(() => {
  if (props.value === null) {
    return null
  }

  return new Intl.NumberFormat(effectiveLocale.value, props.formatOptions).format(props.value)
})
</script>

<template>
  <DataTableCellEmptyValue
    v-if="displayValue === null"
    :value="props.fallback"
  />
  <span
    v-else
    class="truncate text-xs text-primary tabular-nums"
  >
    {{ displayValue }}
  </span>
</template>
