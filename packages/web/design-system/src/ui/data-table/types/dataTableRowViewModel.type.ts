import type { Row } from '@tanstack/vue-table'
import type { Component } from 'vue'

import type { DataTableCell } from '@/ui/data-table/types/dataTableCell.type'

export interface DataTableRowViewModel<TItem> {
  isGroupAllSelected: boolean
  isGrouped: boolean
  isGroupIndeterminate: boolean
  isSelected: boolean
  isSubComponentExpanded: boolean
  canExpandSubComponent: boolean
  groupLabel: string
  groupLabelCell: DataTableCell | null
  row: Row<TItem>
  subComponent: Component | null
}
