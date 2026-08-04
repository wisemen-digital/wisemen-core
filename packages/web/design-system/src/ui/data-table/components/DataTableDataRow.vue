<script setup lang="ts" generic="TItem">
import { FlexRender } from '@tanstack/vue-table'

import DataTableCell from '@/ui/data-table/components/DataTableCell.vue'
import DataTableCheckboxCell from '@/ui/data-table/components/DataTableCheckboxCell.vue'
import DataTableExpandCell from '@/ui/data-table/components/DataTableExpandCell.vue'
import DataTableRow from '@/ui/data-table/components/DataTableRow.vue'
import DataTableSubComponentRow from '@/ui/data-table/components/DataTableSubComponentRow.vue'
import type { DataTableRowViewModel } from '@/ui/data-table/types/dataTableRowViewModel.type'

const props = defineProps<{
  hasSubComponent: boolean
  isSelectable: boolean
  viewModel: DataTableRowViewModel<TItem>
}>()

const emit = defineEmits<{
  toggleSelected: []
  toggleSubComponent: []
}>()
</script>

<template>
  <DataTableRow>
    <DataTableCheckboxCell
      v-if="props.isSelectable"
      :is-checked="props.viewModel.isSelected"
      @toggle="emit('toggleSelected')"
    />

    <DataTableExpandCell
      v-if="props.hasSubComponent"
      :can-expand="props.viewModel.canExpandSubComponent"
      :is-expanded="props.viewModel.isSubComponentExpanded"
      @toggle="emit('toggleSubComponent')"
    />

    <DataTableCell
      v-for="(cell, cellIndex) of props.viewModel.row.getVisibleCells()"
      :key="cell.column.id"
      :is-first-column="!props.isSelectable && !props.hasSubComponent && cellIndex === 0"
      :is-last-column="cellIndex === props.viewModel.row.getVisibleCells().length - 1"
    >
      <FlexRender
        :props="cell.getContext()"
        :render="cell.column.columnDef.cell"
      />
    </DataTableCell>
  </DataTableRow>

  <DataTableSubComponentRow v-if="props.viewModel.isSubComponentExpanded">
    <Component :is="props.viewModel.subComponent" />
  </DataTableSubComponentRow>
</template>
