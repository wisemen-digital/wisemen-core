import type { DataTableCell } from '@/ui/data-table/types/dataTableCell.type'

export interface DataTableColumn<TItem, TKey extends string = string> {
  /**
   * Describes how this column's value should be displayed. The `Cell definition`
   * returned here is presentation-agnostic — the same definition is reused by the
   * detail pane and mobile list, not just the table body.
   */
  cell: (item: TItem) => DataTableCell
  /**
   * The `Cell definition` type this column always renders. Declared explicitly (rather than
   * derived from calling `cell` on a row) so the column's default width is known immediately,
   * even before any data has loaded — see `CONTEXT.md` ("Column sizing — fixed pixel default
   * per cell type"). Not type-checked against `cell`'s actual return value — keep them in sync
   * by convention.
   */
  cellType: DataTableCell['type']
  headerLabel: string
  key: TKey
  /**
   * Fixed pixel width overriding this column's cell-type default. Manual drag-resize still
   * applies on top of whichever width — default or overridden — the column starts at.
   */
  size?: number
}

export function defineDataTableColumns<TItem>() {
  // eslint-disable-next-line eslint-plugin-wisemen/explicit-function-return-type-with-regex
  return <const TKey extends string>(columns: DataTableColumn<TItem, TKey>[]) => columns
}

export type InferDataTableColumnKeys<T extends { key: string }[]> = T[number]['key']
