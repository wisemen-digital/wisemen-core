<script setup lang="ts" generic="TItem">
import { FlexRender } from '@tanstack/vue-table'

import DataTableCell from '@/ui/data-table/components/DataTableCell.vue'
import DataTableCheckboxCell from '@/ui/data-table/components/DataTableCheckboxCell.vue'
import DataTableExpandCell from '@/ui/data-table/components/DataTableExpandCell.vue'
import DataTableRow from '@/ui/data-table/components/DataTableRow.vue'
import DataTableSubComponentRow from '@/ui/data-table/components/DataTableSubComponentRow.vue'
import type { DataTableRowViewModel } from '@/ui/data-table/types/dataTableRowViewModel.type'

const props = defineProps<{
  hasRowActions: boolean
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
  <DataTableRow
    :has-row-actions="props.hasRowActions"
    :inline-actions="props.viewModel.rowConfig?.actions.inline ?? []"
    :is-last="props.viewModel.isLast && !props.viewModel.isSubComponentExpanded"
    :model="props.viewModel.rowConfig?.model ?? null"
    :more-actions="props.viewModel.rowConfig?.actions.more ?? []"
    :on-row-click="props.viewModel.rowConfig?.onClick ?? null"
  >
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
      v-for="cell of props.viewModel.row.getVisibleCells()"
      :key="cell.column.id"
      :column-id="cell.column.id"
      :model="props.viewModel.rowConfig?.model ?? null"
      :on-row-click="props.viewModel.rowConfig?.onClick ?? null"
    >
      <FlexRender
        :props="cell.getContext()"
        :render="cell.column.columnDef.cell"
      />
    </DataTableCell>
  </DataTableRow>

  <DataTableSubComponentRow
    v-if="props.viewModel.isSubComponentExpanded"
    :is-last="props.viewModel.isLast"
  >
    <Component :is="props.viewModel.subComponent" />
  </DataTableSubComponentRow>
</template>
