<script setup lang="ts">
import { computed } from 'vue'

import { getLocaleFromNumberFormat } from '@/types/numberFormat.type'
import { useInjectConfigContext } from '@/ui/config-provider/config.context'
import type { DataTableCurrencyCell } from '@/ui/data-table/types/dataTableCell.type'

const props = defineProps<DataTableCurrencyCell>()

const configContext = useInjectConfigContext()

const effectiveLocale = computed<string>(() => getLocaleFromNumberFormat(configContext.numberFormat.value))

const displayValue = computed<string>(() => {
  if (props.value === null) {
    return props.fallback ?? ''
  }

  return new Intl.NumberFormat(effectiveLocale.value, {
    currency: props.currency,
    style: 'currency',
  }).format(props.value)
})
</script>

<template>
  <span class="truncate text-xs text-primary tabular-nums">
    {{ displayValue }}
  </span>
</template>
