import { QuantityColumn, QuantityColumnOptions } from '#lib/quantity.column.js'
import { PowerUnit } from './power-unit.enum.js'
import { Power } from './power.js'

export function PowerColumn (
  storeAsUnit: PowerUnit,
  options?: QuantityColumnOptions<Power>
) {
  return QuantityColumn(Power, storeAsUnit, options)
}
