import { QuantityColumn, QuantityColumnOptions } from '#lib/quantity.column.js'
import { Area } from './area.js'
import { AreaUnit } from './area-unit.enum.js'

export function AreaColumn (
  storeAsUnit: AreaUnit,
  options?: QuantityColumnOptions<Area>
) {
  return QuantityColumn(Area, storeAsUnit, options)
}
