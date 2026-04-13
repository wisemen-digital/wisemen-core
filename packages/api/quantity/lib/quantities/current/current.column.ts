import { QuantityColumn, QuantityColumnOptions } from '../../quantity.column.js'
import { CurrentUnit } from './current-unit.enum.js'
import { Current } from './current.js'

export function CurrentColumn (
  storeAsUnit: CurrentUnit,
  options?: QuantityColumnOptions<CurrentUnit, Current>
) {
  return QuantityColumn(Current, storeAsUnit, options)
}
