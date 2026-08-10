import type { DataTableCell } from '@/ui/data-table/types/dataTableCell.type'

export const DATA_TABLE_EXPAND_COLUMN_WIDTH = '2.5rem'
export const DATA_TABLE_CHECKBOX_COLUMN_WIDTH = '2.5rem'
// Pixel equivalents of the two constants above (1rem = 16px in this design system's root font
// size — see `tailwind-design-tokens.css`'s `--spacing-*` comments), needed because the sticky
// left-offset calculation (`dataTable.composable.ts`'s `leftStickyOffsetPxByColumnId`) sums
// pixel widths across the checkbox/expand columns and TanStack's own pixel `column.getSize()`
// values — the two can't be summed while one side is a CSS rem string.
export const DATA_TABLE_EXPAND_COLUMN_WIDTH_PX = 40
export const DATA_TABLE_CHECKBOX_COLUMN_WIDTH_PX = 40

// Absolute floor for manual drag-resize — no column can ever be dragged below this, regardless
// of its cell type or declared `size`. Small enough to not be an obstacle for genuinely narrow
// columns ("Id"), large enough that a column can never be dragged fully behind its neighbor.
// See `CONTEXT.md` ("Column resize — minimum width").
export const DATA_TABLE_MIN_COLUMN_WIDTH_PX = 60

// One flat pixel default per `Cell definition` type — not derived from that cell's own config
// (e.g. `Timestamp`'s `isRelative` vs `granularity`, `Id`'s `maxLength` don't change this). A
// column whose default is too narrow for its actual data overrides it via `size`. See
// `CONTEXT.md` ("Column sizing — fixed pixel default per cell type").
export const DATA_TABLE_CELL_DEFAULT_WIDTH_PX: Record<DataTableCell['type'], number> = {
  id: 100,
  badge: 100,
  contactInfo: 200,
  custom: 160,
  location: 180,
  number: 120,
  text: 120,
  timestamp: 140,
}

export class DataTableUtil {
  static columnSizesToGridTemplateColumns(
    columnWidthsPx: number[],
    leadingColumnWidths: string[] = [],
  ): string {
    const columns = columnWidthsPx
      .map((widthPx, index) => (
        index === columnWidthsPx.length - 1
          ? 'minmax(0, auto)'
          : `${widthPx}px`
      ))
      .join(' ')

    return [
      ...leadingColumnWidths,
      columns,
    ].join(' ')
  }
}
