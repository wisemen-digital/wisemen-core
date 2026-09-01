import { QuantityColumn, QuantityColumnOptions } from '#lib/quantity.column.js'
import { DistanceUnit } from './distance-unit.enum.js'
import { Distance } from './distance.js'

export function DistanceColumn (
  storeAsUnit: DistanceUnit,
  options?: QuantityColumnOptions<Distance>
) {
  return QuantityColumn(Distance, storeAsUnit, options)
}
