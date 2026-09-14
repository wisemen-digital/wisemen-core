import type { ComputedRef } from 'vue'

import type { DataTableMobileCardCell } from '@/ui/data-table/components/DataTableMobileCard.vue'
import type { DataTableMobileCardConfig } from '@/ui/data-table/types/dataTable.props'
import type { DataTableColumn } from '@/ui/data-table/types/dataTableColumn.type'

export interface DataTableMobileSlots {
  hiddenCells: DataTableMobileCardCell[]
  indicatorCell: ReturnType<DataTableColumn<unknown>['cell']> | null
  metaCell: ReturnType<DataTableColumn<unknown>['cell']> | null
  primaryCell: ReturnType<DataTableColumn<unknown>['cell']> | null
  secondaryCell: ReturnType<DataTableColumn<unknown>['cell']> | null
}

export function useDataTableMobileSlots<TItem>(
  columns: ComputedRef<DataTableColumn<TItem>[]>,
  mobileCard: ComputedRef<DataTableMobileCardConfig | null>,
): {
  getMobileSlots: (item: TItem) => DataTableMobileSlots
} {
  function getMobileSlots(item: TItem): DataTableMobileSlots {
    const card = mobileCard.value
    const columnByKey = new Map(columns.value.map((column) => [
      column.key,
      column,
    ]))

    function getCell(key: string | undefined): ReturnType<DataTableColumn<TItem>['cell']> | null {
      const column = key === undefined ? undefined : columnByKey.get(key)

      return column === undefined ? null : column.cell(item)
    }

    const slottedKeys = new Set([
      card?.primary,
      card?.secondary,
      card?.meta,
      card?.indicator,
    ].filter((key): key is string => key !== undefined))

    const hiddenCells = columns.value
      .filter((column) => !slottedKeys.has(column.key))
      .map((column) => ({
        cell: column.cell(item),
        headerLabel: column.headerLabel,
        key: column.key,
      }))

    return {
      hiddenCells,
      indicatorCell: getCell(card?.indicator),
      metaCell: getCell(card?.meta),
      primaryCell: getCell(card?.primary),
      secondaryCell: getCell(card?.secondary),
    }
  }

  return {
    getMobileSlots,
  }
}
