import { QuantityColumn, QuantityColumnOptions } from '../../quantity.column.js'
import { PowerUnit } from './power-unit.enum.js'
import { Power } from './power.js'

export function PowerColumn (
  storeAsUnit: PowerUnit,
  options?: QuantityColumnOptions<PowerUnit, Power>
) {
  return QuantityColumn(Power, storeAsUnit, options)
}
