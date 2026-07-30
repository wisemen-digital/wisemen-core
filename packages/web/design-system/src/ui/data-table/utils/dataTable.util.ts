import type { DataTableColumnSize } from '@/ui/data-table/types/dataTableColumn.type'

const FILL_SPACE_COLUMN: DataTableColumnSize = {
  max: 'auto',
  min: 'min-content',
}

function mapSize({
  max, min,
}: DataTableColumnSize): string {
  if (max === 'auto') {
    return `minmax(${min}, auto)`
  }

  if (min === max) {
    return min
  }

  if (min !== 'min-content') {
    return `minmax(${min}, ${max})`
  }

  return `fit-content(${max})`
}

export const DATA_TABLE_EXPAND_COLUMN_WIDTH = '2.5rem'
export const DATA_TABLE_CHECKBOX_COLUMN_WIDTH = '2.5rem'

export class DataTableUtil {
  static columnSizesToGridTemplateColumns(
    columnSizes: DataTableColumnSize[],
    leadingColumnWidths: string[] = [],
  ): string {
    const columns = [
      ...columnSizes.slice(0, -1),
      FILL_SPACE_COLUMN,
    ]
      .map(mapSize)
      .join(' ')

    return [
      ...leadingColumnWidths,
      columns,
    ].join(' ')
  }
}
