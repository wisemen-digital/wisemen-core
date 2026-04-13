import { QuantityColumn, QuantityColumnOptions } from '../../quantity.column.js'
import { DistanceUnit } from './distance-unit.enum.js'
import { Distance } from './distance.js'

export function DistanceColumn (
  storeAsUnit: DistanceUnit,
  options?: QuantityColumnOptions<DistanceUnit, Distance>
) {
  return QuantityColumn(Distance, storeAsUnit, options)
}
