import { QuantityColumn, QuantityColumnOptions } from '../../quantity.column.js'
import { Duration } from './duration.js'
import { DurationUnit } from './duration-unit.enum.js'

export function DurationColumn (
  storeAsUnit: DurationUnit,
  options?: QuantityColumnOptions<DurationUnit, Duration>
) {
  return QuantityColumn(Duration, storeAsUnit, options)
}
