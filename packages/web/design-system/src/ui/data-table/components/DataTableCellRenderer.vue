<script setup lang="ts">
import type { Component } from 'vue'
import { computed } from 'vue'

import DataTableCellAvatar from '@/ui/data-table/components/cells/DataTableCellAvatar.vue'
import DataTableCellBadge from '@/ui/data-table/components/cells/DataTableCellBadge.vue'
import DataTableCellBadgeGroup from '@/ui/data-table/components/cells/DataTableCellBadgeGroup.vue'
import DataTableCellBoolean from '@/ui/data-table/components/cells/DataTableCellBoolean.vue'
import DataTableCellContactInfo from '@/ui/data-table/components/cells/DataTableCellContactInfo.vue'
import DataTableCellCurrency from '@/ui/data-table/components/cells/DataTableCellCurrency.vue'
import DataTableCellId from '@/ui/data-table/components/cells/DataTableCellId.vue'
import DataTableCellLocation from '@/ui/data-table/components/cells/DataTableCellLocation.vue'
import DataTableCellLongText from '@/ui/data-table/components/cells/DataTableCellLongText.vue'
import DataTableCellNumber from '@/ui/data-table/components/cells/DataTableCellNumber.vue'
import DataTableCellText from '@/ui/data-table/components/cells/DataTableCellText.vue'
import DataTableCellTimestamp from '@/ui/data-table/components/cells/DataTableCellTimestamp.vue'
import type { DataTableCell } from '@/ui/data-table/types/dataTableCell.type'

const props = defineProps<{
  cell: DataTableCell
}>()

const customComponent = computed<Component | null>(() => {
  if (props.cell.type !== 'custom') {
    return null
  }

  return props.cell.config.cellComponent(props.cell.value)
})
</script>

<template>
  <DataTableCellText
    v-if="props.cell.type === 'text'"
    v-bind="props.cell"
  />
  <DataTableCellNumber
    v-else-if="props.cell.type === 'number'"
    v-bind="props.cell"
  />
  <DataTableCellTimestamp
    v-else-if="props.cell.type === 'timestamp'"
    v-bind="props.cell"
  />
  <DataTableCellId
    v-else-if="props.cell.type === 'id'"
    v-bind="props.cell"
  />
  <DataTableCellLocation
    v-else-if="props.cell.type === 'location'"
    v-bind="props.cell"
  />
  <DataTableCellContactInfo
    v-else-if="props.cell.type === 'contactInfo'"
    v-bind="props.cell"
  />
  <DataTableCellAvatar
    v-else-if="props.cell.type === 'avatar'"
    v-bind="props.cell"
  />
  <DataTableCellBadge
    v-else-if="props.cell.type === 'badge'"
    v-bind="props.cell"
  />
  <DataTableCellBadgeGroup
    v-else-if="props.cell.type === 'badgeGroup'"
    v-bind="props.cell"
  />
  <DataTableCellCurrency
    v-else-if="props.cell.type === 'currency'"
    v-bind="props.cell"
  />
  <DataTableCellBoolean
    v-else-if="props.cell.type === 'boolean'"
    v-bind="props.cell"
  />
  <DataTableCellLongText
    v-else-if="props.cell.type === 'longText'"
    v-bind="props.cell"
  />
  <Component
    :is="customComponent"
    v-else-if="customComponent !== null"
  />
</template>
