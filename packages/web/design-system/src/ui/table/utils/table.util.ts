import type { TableColumnSize } from '@/ui/table/types/table.type'

const FILL_SPACE_COLUMN: TableColumnSize = {
  max: 'auto',
  min: 'min-content',
}

function mapSize({
  max, min,
}: TableColumnSize): string {
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

export const CHECKBOX_COLUMN_WIDTH = '2.5rem'

export class TableUtil {
  static columnSizesToGridTemplateColumns(
    columnSizes: TableColumnSize[],
    hasActionColumn: boolean,
    hasCheckboxColumn = false,
  ): string {
    const columns = [
      ...columnSizes.slice(0, -1),
      FILL_SPACE_COLUMN,
    ]
      .map(mapSize)
      .join(' ')

    const base = hasActionColumn ? `${columns} min-content` : columns

    return hasCheckboxColumn ? `${CHECKBOX_COLUMN_WIDTH} ${base}` : base
  }
}
