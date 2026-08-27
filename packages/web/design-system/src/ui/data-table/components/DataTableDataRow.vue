<script setup lang="ts" generic="TItem extends RowData">
import type { RowData } from '@tanstack/vue-table'
import { FlexRender } from '@tanstack/vue-table'
import { createAction } from '@wisemen/vue-core-actions'
import { computed } from 'vue'
import { useI18n } from 'vue-i18n'

import DataTableCell from '@/ui/data-table/components/DataTableCell.vue'
import DataTableCheckboxCell from '@/ui/data-table/components/DataTableCheckboxCell.vue'
import DataTableExpandCell from '@/ui/data-table/components/DataTableExpandCell.vue'
import DataTableRow from '@/ui/data-table/components/DataTableRow.vue'
import DataTableSubComponentRow from '@/ui/data-table/components/DataTableSubComponentRow.vue'
import type { DataTableRowViewModel } from '@/ui/data-table/types/dataTableRowViewModel.type'
import { DataTableUtil } from '@/ui/data-table/utils/dataTable.util'

const props = defineProps<{
  hasRowActions: boolean
  hasSubComponent: boolean
  isSelectable: boolean
  viewModel: DataTableRowViewModel<TItem>
  visualColumnOrderIds: string[]
}>()

const emit = defineEmits<{
  toggleSelected: [isRangeSelect: boolean]
  toggleSubComponent: []
}>()

// Body cells must render in the same visual (start-pinned, center, end-pinned) order as the
// header cells and the CSS grid template — `row.getVisibleCells()` only ever returns declared
// order, never pinning order. See `DataTableUtil.toVisualColumnOrder`.
type VisibleCells = ReturnType<typeof props.viewModel.row.getVisibleCells>

const cellsInVisualOrder = computed<VisibleCells>(() => DataTableUtil.toVisualColumnOrder(
  props.viewModel.row.getVisibleCells(),
  (cell) => cell.column.id,
  props.visualColumnOrderIds,
))

const i18n = useI18n()

const toggleSelectionAction = createAction({
  id: 'data-table-row-toggle-selection',
  isApplicable: (ctx) => props.isSelectable && ctx.menuType === undefined,
  name: () => i18n.t('component.data_table.row.toggle_selection_action.name'),
  execute: () => emit('toggleSelected', false),
  keyboardShortcut: {
    key: 'X',
  },
})
</script>

<template>
  <DataTableRow
    :focus-only-actions="[toggleSelectionAction]"
    :has-row-actions="props.hasRowActions"
    :inline-actions="props.viewModel.rowConfig?.actions?.inline ?? []"
    :is-last="props.viewModel.isLast && !props.viewModel.isSubComponentExpanded"
    :model="props.viewModel.rowConfig?.model ?? null"
    :more-actions="props.viewModel.rowConfig?.actions?.more ?? []"
    :on-row-click="props.viewModel.rowConfig?.onClick ?? null"
  >
    <DataTableCheckboxCell
      v-if="props.isSelectable"
      :is-checked="props.viewModel.isSelected"
      @toggle="(isRangeSelect) => emit('toggleSelected', isRangeSelect)"
    />

    <DataTableExpandCell
      v-if="props.hasSubComponent"
      :can-expand="props.viewModel.canExpandSubComponent"
      :is-expanded="props.viewModel.isSubComponentExpanded"
      @toggle="emit('toggleSubComponent')"
    />

    <DataTableCell
      v-for="cell of cellsInVisualOrder"
      :key="cell.column.id"
      :column-id="cell.column.id"
      :model="props.viewModel.rowConfig?.model ?? null"
      :on-row-click="props.viewModel.rowConfig?.onClick ?? null"
    >
      <FlexRender :cell="cell" />
    </DataTableCell>
  </DataTableRow>

  <DataTableSubComponentRow
    v-if="props.viewModel.isSubComponentExpanded"
    :is-last="props.viewModel.isLast"
  >
    <Component :is="props.viewModel.subComponent" />
  </DataTableSubComponentRow>
</template>
