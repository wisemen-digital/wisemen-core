import type { TableColumnSize } from '@/ui/table/types/table.type'

const FILL_SPACE_COLUMN = {
  max: 'auto',
  min: 'min-content',
}

export class TableUtil {
  static columnSizesToGridTemplateColumns(
    columnSizes: TableColumnSize[],
    hasActionColumn: boolean,
  ): string {
    if (hasActionColumn) {
      const columns = [
        ...columnSizes.slice(0, -1),
        FILL_SPACE_COLUMN,
      ]
        .map(({
          max, min,
        }) => `minmax(${min}, ${max})`)
        .join(' ')

      return `${columns} min-content`
    }

    return [
      ...columnSizes.slice(0, -1),
      FILL_SPACE_COLUMN,
    ].map(({
      max, min,
    }) => `minmax(${min}, ${max})`).join(' ')
  }
}
