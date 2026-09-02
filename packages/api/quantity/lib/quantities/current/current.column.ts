import { QuantityColumn, QuantityColumnOptions } from '#lib/quantity.column.js'
import { CurrentUnit } from './current-unit.enum.js'
import { Current } from './current.js'

export function CurrentColumn (
  storeAsUnit: CurrentUnit,
  options?: QuantityColumnOptions<Current>
) {
  return QuantityColumn(Current, storeAsUnit, options)
}
