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

export class TableUtil {
  static columnSizesToGridTemplateColumns(
    columnSizes: TableColumnSize[],
    hasActionColumn: boolean,
  ): string {
    const columns = [
      ...columnSizes.slice(0, -1),
      FILL_SPACE_COLUMN,
    ]
      .map(mapSize)
      .join(' ')

    return hasActionColumn ? `${columns} min-content` : columns
  }
}
