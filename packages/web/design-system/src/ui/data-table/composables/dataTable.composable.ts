import type {
  ColumnDef,
  ColumnPinningState,
  ColumnSizingState,
  ExpandedState,
  GroupingState,
  VisibilityState,
} from '@tanstack/vue-table'
import {
  getCoreRowModel,
  getExpandedRowModel,
  getGroupedRowModel,
  useVueTable,
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
  DATA_TABLE_CELL_DEFAULT_WIDTH_PX,
  DATA_TABLE_CHECKBOX_COLUMN_WIDTH,
  DATA_TABLE_EXPAND_COLUMN_WIDTH,
  DATA_TABLE_MIN_COLUMN_WIDTH_PX,
  DataTableUtil,
} from '@/ui/data-table/utils/dataTable.util'
import { getDataTableCellGroupingValue } from '@/ui/data-table/utils/dataTableCellGroupingValue.util'

export type DataTableGroupBy = string | [string, string] | null

export interface UseDataTableOptions<TItem> {
  hasSubComponent?: ComputedRef<boolean>
  isColumnResizeDisabled?: ComputedRef<boolean>
  isSelectable?: ComputedRef<boolean>
  columns: ComputedRef<DataTableColumn<TItem>[]>
  data: ComputedRef<TItem[]>
  getKey: (item: TItem) => string
  groupBy?: ComputedRef<DataTableGroupBy>
}

export function useDataTable<TItem>(options: UseDataTableOptions<TItem>) {
  const columnVisibility = ref<VisibilityState>({})
  const columnPinning = ref<ColumnPinningState>({})
  // Only ever seeded per-column the moment a user drags that column's resize handle — a column
  // with no entry here just reads its own `columnDef.size` (below), the cell-type default or
  // an explicit override. See `CONTEXT.md` ("Column sizing — fixed pixel default per cell type").
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

  const columnDefs = computed<ColumnDef<TItem>[]>(() => options.columns.value.map((column) => ({
    id: column.key,
    accessorFn: (item): unknown => getDataTableCellGroupingValue(column.cell(item)),
    cell: (context): VNode => h(DataTableCellRenderer, {
      cell: column.cell(context.row.original),
    }),
    header: column.headerLabel,
    minSize: DATA_TABLE_MIN_COLUMN_WIDTH_PX,
    size: column.size ?? DATA_TABLE_CELL_DEFAULT_WIDTH_PX[column.cellType],
  })))

  const table = useVueTable({
    getRowId: (item) => options.getKey(item),
    // Live resize while dragging, not just on release — matches the current `Table`'s
    // hand-rolled mousemove handler and the OS/spreadsheet drag-resize mental model. The
    // per-drag re-render cost this implies is bounded by virtualization capping rendered row
    // count regardless of table width. See `CONTEXT.md` ("Column resize").
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
    getCoreRowModel: getCoreRowModel(),
    getExpandedRowModel: getExpandedRowModel(),
    getGroupedRowModel: getGroupedRowModel(),
    getRowCanExpand: (row) => row.getIsGrouped(),
    // TanStack's default (`'reorder'`) moves the grouped-by column to the front of every leaf
    // column list — `getVisibleLeafColumns()`, `getFlatHeaders()`, `row.getVisibleCells()` — which
    // silently desyncs any index-based rendering (header cells, resize handles, cell order) from
    // a consumer's declared `columns` order. DataTable renders its own explicit group-header row
    // (`DataTableGroupRow`) and has no use for TanStack also reordering the data columns, so this
    // is disabled outright. See `CONTEXT.md` ("Grouping — column order").
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
    onColumnPinningChange: (updaterOrValue) => {
      columnPinning.value = typeof updaterOrValue === 'function'
        ? updaterOrValue(columnPinning.value)
        : updaterOrValue
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

  function pinFirstColumn(isSticky: boolean): void {
    const firstColumnId = columnDefs.value[0]?.id

    if (firstColumnId === undefined) {
      return
    }

    table.setColumnPinning((previous) => ({
      ...previous,
      left: isSticky
        ? [
            firstColumnId,
          ]
        : [],
    }))
  }

  function pinLastColumn(isSticky: boolean): void {
    const lastColumnId = columnDefs.value.at(-1)?.id

    if (lastColumnId === undefined) {
      return
    }

    table.setColumnPinning((previous) => ({
      ...previous,
      right: isSticky
        ? [
            lastColumnId,
          ]
        : [],
    }))
  }

  // Shared by two callers: double-click-to-fit (no TanStack equivalent — `DataTableHeaderCell`
  // measures its own rendered content width and hands it here) and drag-resize-start (seeding
  // TanStack's `columnSizing` with the column's actual current width before the drag begins —
  // TanStack's own `header.getSize()` falls back to `defaultColumnSizing.size` (150px) for a
  // column with no entry yet, which would jump the column to 150px on its very first resize if
  // not seeded first. See `CONTEXT.md` ("Column resize — first-drag jump").
  function setColumnSize(columnKey: string, widthPx: number): void {
    table.setColumnSizing((previous) => ({
      ...previous,
      [columnKey]: widthPx,
    }))
  }

  const gridTemplateColumns = computed<string>(() => {
    const visibleColumns = table.getVisibleLeafColumns()

    const columnWidthsPx = visibleColumns.map((column) => column.getSize())

    const leadingColumnWidths: string[] = []

    if (options.isSelectable?.value ?? false) {
      leadingColumnWidths.push(DATA_TABLE_CHECKBOX_COLUMN_WIDTH)
    }

    if (options.hasSubComponent?.value ?? false) {
      leadingColumnWidths.push(DATA_TABLE_EXPAND_COLUMN_WIDTH)
    }

    return DataTableUtil.columnSizesToGridTemplateColumns(columnWidthsPx, leadingColumnWidths)
  })

  return {
    gridTemplateColumns,
    pinFirstColumn,
    pinLastColumn,
    setColumnSize,
    table,
  }
}
