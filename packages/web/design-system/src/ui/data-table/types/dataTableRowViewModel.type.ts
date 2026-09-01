import type {
  Row,
  RowData,
} from '@tanstack/vue-table'
import type { Component } from 'vue'

import type { DataTableFeatures } from '@/ui/data-table/composables/dataTable.composable'
import type { DataTableCell } from '@/ui/data-table/types/dataTableCell.type'
import type { DataTableRowConfig } from '@/ui/data-table/types/dataTableRowConfig.type'

export interface DataTableRowViewModel<TItem extends RowData> {
  isGroupAllSelected: boolean
  isGrouped: boolean
  isGroupIndeterminate: boolean
  isLast: boolean
  isSelected: boolean
  isSubComponentExpanded: boolean
  canExpandSubComponent: boolean
  groupLabel: string
  groupLabelCell: DataTableCell | null
  row: Row<DataTableFeatures, TItem>
  rowConfig: DataTableRowConfig | null
  subComponent: Component | null
}
