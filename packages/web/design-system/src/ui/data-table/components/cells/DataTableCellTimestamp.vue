<script setup lang="ts">
import {
  useDateTimeConfig,
  useDateTimeFormat,
} from '@wisemen/vue-core-dates'
import { computed } from 'vue'

import DataTableCellEmptyValue from '@/ui/data-table/components/cells/DataTableCellEmptyValue.vue'
import type { DataTableTimestampCell } from '@/ui/data-table/types/dataTableCell.type'
import { UITooltip } from '@/ui/tooltip'

const props = defineProps<DataTableTimestampCell>()

const dateFormat = useDateTimeFormat()
const dateConfig = useDateTimeConfig()

function toYear(value: NonNullable<DataTableTimestampCell['value']>): string {
  const zonedDateTime = value.toZonedDateTimeISO(dateConfig.timeZone.value)

  return new Intl.DateTimeFormat(dateConfig.locale.value, {
    timeZone: dateConfig.timeZone.value,
    year: 'numeric',
  }).format(zonedDateTime.epochMilliseconds)
}

const displayValue = computed<string | null>(() => {
  if (props.value === null) {
    return null
  }

  if (props.isRelative === true) {
    return dateFormat.toRelativeTime(props.value)
  }

  switch (props.granularity) {
    case 'year':
      return toYear(props.value)
    case 'month':
      return dateFormat.toMonthAndYear(props.value)
    case 'day':
      return dateFormat.toDate(props.value)
    case 'second':
      return dateFormat.toDateTime(props.value, true)
    default:
      return dateFormat.toDateTime(props.value, false)
  }
})

const fullDateTime = computed<string | null>(() => {
  if (props.value === null) {
    return null
  }

  return dateFormat.toDateTime(props.value, true)
})
</script>

<template>
  <DataTableCellEmptyValue
    v-if="displayValue === null"
    :value="props.fallback"
  />

  <UITooltip
    v-else-if="props.isRelative === true && fullDateTime !== null"
    popover-side="top"
  >
    <template #trigger>
      <span
        class="pointer-events-auto truncate text-xs text-primary tabular-nums"
      >
        {{ displayValue }}
      </span>
    </template>

    <template #content>
      <span class="flex px-sm py-xs text-xs text-secondary tabular-nums">
        {{ fullDateTime }}
      </span>
    </template>
  </UITooltip>

  <span
    v-else
    class="truncate text-xs text-primary tabular-nums"
  >
    {{ displayValue }}
  </span>
</template>
