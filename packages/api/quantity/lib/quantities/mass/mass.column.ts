import { QuantityColumn, QuantityColumnOptions } from '../../quantity.column.js'
import { MassUnit } from './mass-unit.enum.js'
import { Mass } from './mass.js'

export function MassColumn (
  storeAsUnit: MassUnit,
  options?: QuantityColumnOptions<MassUnit, Mass>
) {
  return QuantityColumn(Mass, storeAsUnit, options)
}
