import type { DataTableCell } from '@/ui/data-table/types/dataTableCell.type'

// Shown in place of a cell's value when it's `null` and no per-cell `fallback` was given — a
// muted dash reads as "confirmed empty" rather than "still loading"/"broken", unlike rendering
// nothing at all.
export const DATA_TABLE_CELL_EMPTY_VALUE_FALLBACK = '–'

export const DATA_TABLE_EXPAND_COLUMN_WIDTH = '2.5rem'
// Wider than a bare `size-4` checkbox (16px) plus `px-xl` (16px each side) would strictly need —
// with the sticky-left border now always a possibility (see `hasCheckboxOwnStickyBorder`), the
// checkbox needs real breathing room on its right side before that divider, not just enough to
// fit.
export const DATA_TABLE_CHECKBOX_COLUMN_WIDTH = '3rem'
// Wide enough for two icon buttons (inline action + the `⋯` overflow trigger) — matches the
// old `Table`'s actions cell width.
export const DATA_TABLE_ACTIONS_COLUMN_WIDTH = '5rem'
// Pixel equivalents of the constants above (1rem = 16px in this design system's root font
// size — see `tailwind-design-tokens.css`'s `--spacing-*` comments), needed because the sticky
// offset calculations (`dataTable.composable.ts`'s `leftStickyOffsetPxByColumnId`/
// `rightStickyOffsetPxByColumnId`) sum pixel widths across the checkbox/expand/actions columns
// and TanStack's own pixel `column.getSize()` values — the two can't be summed while one side
// is a CSS rem string.
export const DATA_TABLE_EXPAND_COLUMN_WIDTH_PX = 40
export const DATA_TABLE_CHECKBOX_COLUMN_WIDTH_PX = 48
export const DATA_TABLE_ACTIONS_COLUMN_WIDTH_PX = 80

// Absolute floor for manual drag-resize — no column can ever be dragged below this, regardless
// of its cell type or declared `size`. Small enough to not be an obstacle for genuinely narrow
// columns ("Id"), large enough that a column can never be dragged fully behind its neighbor.
export const DATA_TABLE_MIN_COLUMN_WIDTH_PX = 60

// One flat pixel default per `Cell definition` type — not derived from that cell's own config
// (e.g. `Timestamp`'s `isRelative` vs `granularity`, `Id`'s `maxLength` don't change this). A
// column whose default is too narrow for its actual data overrides it via `size`.
export const DATA_TABLE_CELL_DEFAULT_WIDTH_PX: Record<DataTableCell['type'], number> = {
  id: 100,
  // Avatar plus a label, wider than plain text since it carries both.
  avatar: 200,
  badge: 100,
  // Wider than a single badge to fit several inline.
  badgeGroup: 200,
  // Icon-only, no a11y label text rendered inline.
  boolean: 80,
  // Icon-only row (phone/email/website), narrower than the old inline-text layout.
  contactInfo: 120,
  currency: 120,
  custom: 160,
  location: 180,
  // Wider than `text` since long text is the point.
  longText: 240,
  number: 120,
  text: 120,
  timestamp: 140,
}

export class DataTableUtil {
  static columnSizesToGridTemplateColumns(
    columnWidthsPx: number[],
    leadingColumnWidths: string[] = [],
    trailingColumnWidths: string[] = [],
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
      ...trailingColumnWidths,
    ].join(' ')
  }

  /**
   * Reorders any column-keyed list (real `Column`s, `Header`s, `Cell`s — anything `getColumnId`
   * can pull a column id out of) to match visual order: start-pinned columns, then center
   * (unpinned) columns, then end-pinned columns. Every consumer that renders or sizes columns
   * side by side — the CSS grid template, header cells, body cells — needs this exact same
   * order; TanStack's own "visible"/"flat" APIs (`getVisibleLeafColumns()`, `getFlatHeaders()`,
   * `row.getVisibleCells()`) never reorder for pinning, they only ever return declared order.
   * Rendering in declared order while pinned columns are visually pulled out via
   * `position: sticky` leaves a column's real grid track sitting at its old declared position,
   * with nothing telling the grid that track has moved — the exact bug this exists to prevent
   * (a live column resize visibly opens a gap at the column's un-pinned position, since resizing
   * changes that stale track's width while nothing is visually anchored there anymore).
   */
  static toVisualColumnOrder<TColumnLike>(
    items: TColumnLike[],
    getColumnId: (item: TColumnLike) => string,
    orderedColumnIds: string[],
  ): TColumnLike[] {
    const itemByColumnId = new Map(items.map((item) => [
      getColumnId(item),
      item,
    ]))

    return orderedColumnIds
      .map((columnId) => itemByColumnId.get(columnId))
      .filter((item): item is TColumnLike => item !== undefined)
  }
}
