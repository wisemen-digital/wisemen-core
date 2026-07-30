import type {
  ColumnDef,
  ColumnPinningState,
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
import type {
  DataTableColumn,
  DataTableColumnSize,
} from '@/ui/data-table/types/dataTableColumn.type'
import {
  DATA_TABLE_CHECKBOX_COLUMN_WIDTH,
  DATA_TABLE_EXPAND_COLUMN_WIDTH,
  DataTableUtil,
} from '@/ui/data-table/utils/dataTable.util'
import { getDataTableCellGroupingValue } from '@/ui/data-table/utils/dataTableCellGroupingValue.util'

export type DataTableGroupBy = string | [string, string] | null

export interface UseDataTableOptions<TItem> {
  hasSubComponent?: ComputedRef<boolean>
  isSelectable?: ComputedRef<boolean>
  columns: ComputedRef<DataTableColumn<TItem>[]>
  data: ComputedRef<TItem[]>
  getKey: (item: TItem) => string
  groupBy?: ComputedRef<DataTableGroupBy>
}

export function useDataTable<TItem>(options: UseDataTableOptions<TItem>) {
  const columnVisibility = ref<VisibilityState>({})
  const columnPinning = ref<ColumnPinningState>({})
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
  })))

  const table = useVueTable({
    getRowId: (item) => options.getKey(item),
    get columns() {
      return columnDefs.value
    },
    get data() {
      return options.data.value
    },
    getCoreRowModel: getCoreRowModel(),
    getExpandedRowModel: getExpandedRowModel(),
    getGroupedRowModel: getGroupedRowModel(),
    getRowCanExpand: (row) => row.getIsGrouped(),
    state: {
      get columnPinning() {
        return columnPinning.value
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

  const defaultColumnSize: DataTableColumnSize = {
    max: '20rem',
    min: 'min-content',
  }

  const gridTemplateColumns = computed<string>(() => {
    const visibleColumnIds = new Set(table.getVisibleLeafColumns().map((column) => column.id))

    const sizes = options.columns.value
      .filter((column) => visibleColumnIds.has(column.key))
      .map((column) => column.size ?? defaultColumnSize)

    const leadingColumnWidths: string[] = []

    if (options.isSelectable?.value ?? false) {
      leadingColumnWidths.push(DATA_TABLE_CHECKBOX_COLUMN_WIDTH)
    }

    if (options.hasSubComponent?.value ?? false) {
      leadingColumnWidths.push(DATA_TABLE_EXPAND_COLUMN_WIDTH)
    }

    return DataTableUtil.columnSizesToGridTemplateColumns(sizes, leadingColumnWidths)
  })

  return {
    gridTemplateColumns,
    pinFirstColumn,
    pinLastColumn,
    table,
  }
}
