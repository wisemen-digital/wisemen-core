import type {
  ColumnDef,
  ColumnPinningState,
  ColumnSizingState,
  ColumnVisibilityState,
  ExpandedState,
  GroupingState,
  RowData,
} from '@tanstack/vue-table'
import {
  columnGroupingFeature,
  columnPinningFeature,
  columnResizingFeature,
  columnSizingFeature,
  columnVisibilityFeature,
  createExpandedRowModel,
  createGroupedRowModel,
  rowExpandingFeature,
  tableFeatures,
  useTable,
} from '@tanstack/vue-table'
import type {
  ComputedRef,
  VNode,
} from 'vue'
import {
  computed,
  h,
  ref,
} from 'vue'

import DataTableCellRenderer from '@/ui/data-table/components/DataTableCellRenderer.vue'
import type { DataTableColumn } from '@/ui/data-table/types/dataTableColumn.type'
import {
  DATA_TABLE_ACTIONS_COLUMN_WIDTH,
  DATA_TABLE_ACTIONS_COLUMN_WIDTH_PX,
  DATA_TABLE_CELL_DEFAULT_WIDTH_PX,
  DATA_TABLE_CHECKBOX_COLUMN_WIDTH,
  DATA_TABLE_CHECKBOX_COLUMN_WIDTH_PX,
  DATA_TABLE_EXPAND_COLUMN_WIDTH,
  DATA_TABLE_EXPAND_COLUMN_WIDTH_PX,
  DATA_TABLE_MIN_COLUMN_WIDTH_PX,
  DataTableUtil,
} from '@/ui/data-table/utils/dataTable.util'
import { getDataTableCellGroupingValue } from '@/ui/data-table/utils/dataTableCellGroupingValue.util'

export type DataTableGroupBy = string | [string, string] | null

// Only the features DataTable actually reads/writes: grouping + expanding (both driven by our
// own `groupBy`/`subComponent` props, not TanStack's own UI), pinning (derived from
// `isFirstColumnSticky`/`isLastColumnSticky`/`isSticky`, never user-draggable), sizing + resizing
// (manual drag-resize), and visibility (idle today — see `DataTable.vue`'s `columnVisibility`
// comment — kept registered since `state.columnVisibility` is already wired end to end for the
// planned column-priority/responsive-hiding feature). No sorting feature: `Sort` is our own
// composable, entirely outside TanStack's own sorting state.
export const dataTableFeatures = tableFeatures({
  columnGroupingFeature,
  columnPinningFeature,
  columnResizingFeature,
  columnSizingFeature,
  columnVisibilityFeature,
  expandedRowModel: createExpandedRowModel(),
  groupedRowModel: createGroupedRowModel(),
  rowExpandingFeature,
})

export type DataTableFeatures = typeof dataTableFeatures

export interface UseDataTableOptions<TItem extends RowData> {
  hasRowActions?: ComputedRef<boolean>
  hasSubComponent?: ComputedRef<boolean>
  isColumnResizeDisabled?: ComputedRef<boolean>
  isFirstColumnSticky?: ComputedRef<boolean>
  isLastColumnSticky?: ComputedRef<boolean>
  isSelectable?: ComputedRef<boolean>
  columns: ComputedRef<DataTableColumn<TItem>[]>
  data: ComputedRef<TItem[]>
  getKey: (item: TItem) => string
  groupBy?: ComputedRef<DataTableGroupBy>
}

export function useDataTable<TItem extends RowData>(options: UseDataTableOptions<TItem>) {
  const columnVisibility = ref<ColumnVisibilityState>({})
  // Only ever seeded per-column the moment a user drags that column's resize handle — a column
  // with no entry here just reads its own `columnDef.size` (below), the cell-type default or
  // an explicit override.
  const columnSizing = ref<ColumnSizingState>({})
  // Groups default to expanded, matching the current `Table`'s `isOpenByDefault: true` default.
  const expanded = ref<ExpandedState>(true)

  const grouping = computed<GroupingState>(() => {
    const groupBy = options.groupBy?.value ?? null

    if (groupBy === null) {
      return []
    }

    return Array.isArray(groupBy)
      ? groupBy
      : [
          groupBy,
        ]
  })

  const columnDefs = computed<ColumnDef<DataTableFeatures, TItem>[]>(() => options.columns.value.map((column) => ({
    id: column.key,
    accessorFn: (item): unknown => getDataTableCellGroupingValue(column.cell(item)),
    cell: (context): VNode => h(DataTableCellRenderer, {
      cell: column.cell(context.row.original),
    }),
    header: column.headerLabel,
    minSize: DATA_TABLE_MIN_COLUMN_WIDTH_PX,
    size: column.size ?? DATA_TABLE_CELL_DEFAULT_WIDTH_PX[column.cellType],
  })))

  // Derived, not settable — array order matters, since the offset computeds below sum
  // cumulatively in this order (closest-to-edge first). `start`/`end` are v9's logical rename of
  // v8's `left`/`right` — this codebase is LTR-only today, so `start` === left, `end` === right.
  const columnPinning = computed<ColumnPinningState>(() => {
    const firstColumnId = columnDefs.value[0]?.id
    const lastColumnId = columnDefs.value.at(-1)?.id

    const start = options.isFirstColumnSticky?.value === true && firstColumnId !== undefined
      ? [
          firstColumnId,
        ]
      : []
    const end = options.isLastColumnSticky?.value === true && lastColumnId !== undefined
      ? [
          lastColumnId,
        ]
      : []

    const keyPinnedEndIds: string[] = []

    for (const column of options.columns.value) {
      if (column.isSticky === 'left' && column.key !== firstColumnId) {
        start.push(column.key)
      }
      else if (column.isSticky === 'right' && column.key !== lastColumnId) {
        keyPinnedEndIds.push(column.key)
      }
    }

    // Reversed: collected left-to-right, but `end` needs closest-to-the-edge first.
    end.push(...keyPinnedEndIds.reverse())

    return {
      end,
      start,
    }
  })

  const table = useTable<DataTableFeatures, TItem>({
    getRowId: (item) => options.getKey(item),
    // Live resize while dragging, not just on release — matches the current `Table`'s
    // hand-rolled mousemove handler and the OS/spreadsheet drag-resize mental model. The
    // per-drag re-render cost this implies is bounded by virtualization capping rendered row
    // count regardless of table width.
    columnResizeMode: 'onChange',
    get columns() {
      return columnDefs.value
    },
    get data() {
      return options.data.value
    },
    get enableColumnResizing() {
      return !(options.isColumnResizeDisabled?.value ?? false)
    },
    features: dataTableFeatures,
    getRowCanExpand: (row) => row.getIsGrouped(),
    // TanStack's default (`'reorder'`) moves the grouped-by column to the front of every leaf
    // column list — `getVisibleLeafColumns()`, `getFlatHeaders()`, `row.getVisibleCells()` — which
    // silently desyncs any index-based rendering (header cells, resize handles, cell order) from
    // a consumer's declared `columns` order. DataTable renders its own explicit group-header row
    // (`DataTableGroupRow`) and has no use for TanStack also reordering the data columns, so this
    // is disabled outright.
    groupedColumnMode: false,
    state: {
      get columnPinning() {
        return columnPinning.value
      },
      get columnSizing() {
        return columnSizing.value
      },
      get columnVisibility() {
        return columnVisibility.value
      },
      get expanded() {
        return expanded.value
      },
      get grouping() {
        return grouping.value
      },
    },
    onColumnPinningChange: () => {
      // Pinning is derived, not user-draggable — ignore TanStack's own attempts to change it.
    },
    onColumnSizingChange: (updaterOrValue) => {
      columnSizing.value = typeof updaterOrValue === 'function'
        ? updaterOrValue(columnSizing.value)
        : updaterOrValue
    },
    onColumnVisibilityChange: (updaterOrValue) => {
      columnVisibility.value = typeof updaterOrValue === 'function'
        ? updaterOrValue(columnVisibility.value)
        : updaterOrValue
    },
    onExpandedChange: (updaterOrValue) => {
      expanded.value = typeof updaterOrValue === 'function'
        ? updaterOrValue(expanded.value)
        : updaterOrValue
    },
    onGroupingChange: () => {
      // Grouping is derived from the `groupBy` option, not user-toggleable — ignore TanStack's
      // internal attempts to change it (e.g. via column grouping UI we don't expose).
    },
  })

  // Shared by two callers: double-click-to-fit (no TanStack equivalent — `DataTableHeaderCell`
  // measures its own rendered content width and hands it here) and drag-resize-start (seeding
  // TanStack's `columnSizing` with the column's actual current width before the drag begins —
  // TanStack's own `header.getSize()` falls back to `defaultColumnSizing.size` (150px) for a
  // column with no entry yet, which would jump the column to 150px on its very first resize if
  // not seeded first.
  function setColumnSize(columnKey: string, widthPx: number): void {
    table.setColumnSizing((previous) => ({
      ...previous,
      [columnKey]: widthPx,
    }))
  }

  // Real (non-checkbox/expand/actions) column ids, in actual visual order — start-pinned first,
  // then center (unpinned), then end-pinned — not TanStack's own declared/"flat" order. Every
  // consumer that renders or sizes columns side by side (the grid template below, `DataTable.vue`'s
  // header cells, `DataTableDataRow.vue`'s body cells) must share this exact order, or a pinned
  // column's grid track and its visually-pulled-out `position: sticky` box desync — see
  // `DataTableUtil.toVisualColumnOrder`, which every one of those consumers reorders through.
  const visualColumnOrderIds = computed<string[]>(() => [
    ...table.getStartLeafColumns(),
    ...table.getCenterLeafColumns(),
    ...table.getEndLeafColumns(),
  ].map((column) => column.id))

  const gridTemplateColumns = computed<string>(() => {
    const visibleColumns = DataTableUtil.toVisualColumnOrder(
      table.getVisibleLeafColumns(),
      (column) => column.id,
      visualColumnOrderIds.value,
    )

    const columnWidthsPx = visibleColumns.map((column) => column.getSize())

    const leadingColumnWidths: string[] = []

    if (options.isSelectable?.value ?? false) {
      leadingColumnWidths.push(DATA_TABLE_CHECKBOX_COLUMN_WIDTH)
    }

    if (options.hasSubComponent?.value ?? false) {
      leadingColumnWidths.push(DATA_TABLE_EXPAND_COLUMN_WIDTH)
    }

    const trailingColumnWidths: string[] = []

    if (options.hasRowActions?.value ?? false) {
      trailingColumnWidths.push(DATA_TABLE_ACTIONS_COLUMN_WIDTH)
    }

    return DataTableUtil.columnSizesToGridTemplateColumns(columnWidthsPx, leadingColumnWidths, trailingColumnWidths)
  })

  // Checkbox/expand aren't real TanStack columns, so their leading offset is tracked separately.
  const leadingStickyOffsetsPx = computed<{ checkbox: number
    expand: number }>(() => {
    const isSelectable = options.isSelectable?.value ?? false

    return {
      checkbox: 0,
      expand: isSelectable ? DATA_TABLE_CHECKBOX_COLUMN_WIDTH_PX : 0,
    }
  })

  // True once at least one real column is pinned left, or the checkbox/expand column is present —
  // both always stick regardless of `isFirstColumnSticky`, since selection and row-expansion
  // controls should never be able to scroll out of view.
  const isLeadingStickyRegionActive = computed<boolean>(
    () => table.getStartLeafColumns().length > 0
      || (options.isSelectable?.value ?? false)
      || (options.hasSubComponent?.value ?? false),
  )

  // The checkbox column normally has no border of its own — the sticky-left region's trailing
  // border is drawn by whichever real column (or the expand column) sits at the region's edge.
  // When the checkbox is unconditionally sticky (above) but nothing else joins it — no expand
  // column, no column actually pinned left — it's the last thing in the region and needs its own
  // border, or the sticky checkbox would have no visible divider from the scrolling content next
  // to it.
  const hasCheckboxOwnStickyBorder = computed<boolean>(
    () => (options.isSelectable?.value ?? false)
      && !(options.hasSubComponent?.value ?? false)
      && table.getStartLeafColumns().length === 0,
  )

  // Mirrors `hasCheckboxOwnStickyBorder` for the expand column — it's the sticky region's trailing
  // edge (and so needs its own border) whenever it's present and no real column is pinned left,
  // regardless of whether the checkbox column precedes it.
  const hasExpandOwnStickyBorder = computed<boolean>(
    () => (options.hasSubComponent?.value ?? false)
      && table.getStartLeafColumns().length === 0,
  )

  // Cumulative left offset (px) per real pinned column, keyed by column id.
  const leftStickyOffsetPxByColumnId = computed<Map<string, number>>(() => {
    const offsetByColumnId = new Map<string, number>()
    let offsetPx = 0

    if (options.isSelectable?.value ?? false) {
      offsetPx += DATA_TABLE_CHECKBOX_COLUMN_WIDTH_PX
    }

    if (options.hasSubComponent?.value ?? false) {
      offsetPx += DATA_TABLE_EXPAND_COLUMN_WIDTH_PX
    }

    for (const column of table.getStartLeafColumns()) {
      offsetByColumnId.set(column.id, offsetPx)
      offsetPx += column.getSize()
    }

    return offsetByColumnId
  })

  // Mirrors `leftStickyOffsetPxByColumnId`, from the right edge inward — starting past the
  // trailing actions column (not a real TanStack column) so a right-pinned data column never
  // sits underneath it.
  const rightStickyOffsetPxByColumnId = computed<Map<string, number>>(() => {
    const offsetByColumnId = new Map<string, number>()
    let offsetPx = options.hasRowActions?.value ?? false ? DATA_TABLE_ACTIONS_COLUMN_WIDTH_PX : 0

    for (const column of table.getEndLeafColumns()) {
      offsetByColumnId.set(column.id, offsetPx)
      offsetPx += column.getSize()
    }

    return offsetByColumnId
  })

  // Column carrying the sticky-left group's trailing border — the rightmost pinned column.
  const leftStickyBorderColumnId = computed<string | null>(
    () => Array.from(leftStickyOffsetPxByColumnId.value.keys()).at(-1) ?? null,
  )

  // Mirrors `leftStickyBorderColumnId` for the right-pinned group.
  const rightStickyBorderColumnId = computed<string | null>(
    () => Array.from(rightStickyOffsetPxByColumnId.value.keys()).at(-1) ?? null,
  )

  return {
    leftStickyBorderColumnId,
    leftStickyOffsetPxByColumnId,
    rightStickyBorderColumnId,
    rightStickyOffsetPxByColumnId,
    hasCheckboxOwnStickyBorder,
    hasExpandOwnStickyBorder,
    isLeadingStickyRegionActive,
    gridTemplateColumns,
    leadingStickyOffsetsPx,
    setColumnSize,
    table,
    visualColumnOrderIds,
  }
}
