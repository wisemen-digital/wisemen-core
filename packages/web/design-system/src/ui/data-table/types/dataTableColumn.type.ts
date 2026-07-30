import type { DataTableCell } from '@/ui/data-table/types/dataTableCell.type'

type Unit = '%' | 'fr' | 'rem'
type Size = 'auto' | 'min-content' | `${number}${Unit}`

export interface DataTableColumnSize {
  max: Size
  min: Size
}

export interface DataTableColumn<TItem, TKey extends string = string> {
  /**
   * Describes how this column's value should be displayed. The `Cell definition`
   * returned here is presentation-agnostic — the same definition is reused by the
   * detail pane and mobile list, not just the table body.
   */
  cell: (item: TItem) => DataTableCell
  headerLabel: string
  key: TKey
  size?: DataTableColumnSize
}

export function defineDataTableColumns<TItem>() {
  // eslint-disable-next-line eslint-plugin-wisemen/explicit-function-return-type-with-regex
  return <const TKey extends string>(columns: DataTableColumn<TItem, TKey>[]) => columns
}

export type InferDataTableColumnKeys<T extends { key: string }[]> = T[number]['key']
