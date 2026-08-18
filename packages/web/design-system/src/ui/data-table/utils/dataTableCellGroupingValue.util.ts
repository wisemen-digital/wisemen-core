import type { DataTableCell } from '@/ui/data-table/types/dataTableCell.type'

/**
 * Extracts a scalar grouping/sort key from a `Cell definition`. `ContactInfo` and `Custom`
 * cells have no single scalar value to group by and return `null` — grouping by one of these
 * columns puts every row in a single group rather than erroring, since TanStack still needs
 * some value to key on.
 */
export function getDataTableCellGroupingValue(cell: DataTableCell): unknown {
  switch (cell.type) {
    case 'text':
    case 'number':
    case 'currency':
    case 'boolean':
    case 'id':
      return cell.value
    case 'timestamp':
      return cell.value?.epochMilliseconds ?? null
    case 'badge':
      return cell.label ?? null
    case 'location':
      if (cell.value === null) {
        return null
      }

      switch (cell.precision) {
        case 'country':
          return cell.value.country
        case 'municipality':
          return cell.value.city
        default:
          return [
            cell.value.street,
            cell.value.streetNumber,
          ].filter(Boolean).join(' ')
      }
    default:
      return null
  }
}
