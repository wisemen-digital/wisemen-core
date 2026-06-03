<script setup lang="ts">
import BaseCheckbox from '@/ui/checkbox/base/BaseCheckbox.vue'
import TableBodyRowCell from '@/ui/table/components/TableBodyRowCell.vue'
import TableBodyRowCellInteractiveElement from '@/ui/table/components/TableBodyRowCellInteractiveElement.vue'
import { useInjectTableSelectionContext } from '@/ui/table/context/tableSelection.context'

const props = defineProps<{
  itemKey: string
}>()

const {
  isItemSelected, toggleItem,
} = useInjectTableSelectionContext()
</script>

<template>
  <TableBodyRowCell>
    <TableBodyRowCellInteractiveElement>
      <BaseCheckbox
        :model-value="isItemSelected(props.itemKey)"
        label="TODO"
        is-label-hidden
        @update:model-value="toggleItem(props.itemKey)"
      />
    </TableBodyRowCellInteractiveElement>
  </TableBodyRowCell>
</template>
