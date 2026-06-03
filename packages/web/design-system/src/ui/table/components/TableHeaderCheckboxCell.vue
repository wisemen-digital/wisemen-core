<script setup lang="ts">
import BaseCheckbox from '@/ui/checkbox/base/BaseCheckbox.vue'
import TableHeaderCellBase from '@/ui/table/components/TableHeaderCellBase.vue'
import { useInjectTableSelectionContext } from '@/ui/table/context/tableSelection.context'

const {
  isAllSelected,
  isIndeterminate,
  toggleAll,
} = useInjectTableSelectionContext()
</script>

<template>
  <TableHeaderCellBase>
    <BaseCheckbox
      :model-value="isAllSelected || isIndeterminate"
      :is-indeterminate="isIndeterminate && !isAllSelected"
      :is-label-hidden="true"
      label="TODO"
      @update:model-value="toggleAll"
    />
  </TableHeaderCellBase>
</template>
