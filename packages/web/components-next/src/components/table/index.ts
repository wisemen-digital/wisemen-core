import type { TableProps } from './table.props'

export { default as VcTableBody } from './parts/TableBody.vue'
export { default as VcTableCell } from './parts/TableCell.vue'
export { default as VcTableCellSkeleton } from './parts/TableCellSkeleton.vue'
export { default as VcTableContent } from './parts/TableContent.vue'
export { default as VcTableHeader } from './parts/TableHeader.vue'
export { default as VcTableHeaderCell } from './parts/TableHeaderCell.vue'
export { default as VcTableHiddenResultsHint } from './parts/TableHiddenResultsHint.vue'
export { default as VcTableRoot } from './parts/TableRoot.vue'
export { default as VcTableRow } from './parts/TableRow.vue'
export { default as VcTableScrollContainer } from './parts/TableScrollContainer.vue'
export { type TableRowAction } from './table.type'
export type VcTableProps = Omit<TableProps, 'classConfig' | 'variant'>
