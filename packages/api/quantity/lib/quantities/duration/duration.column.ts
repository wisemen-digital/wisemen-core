import { QuantityColumn, QuantityColumnOptions } from '#lib/quantity.column.js'
import { Duration } from './duration.js'
import { DurationUnit } from './duration-unit.enum.js'

export function DurationColumn (
  storeAsUnit: DurationUnit,
  options?: QuantityColumnOptions<Duration>
) {
  return QuantityColumn(Duration, storeAsUnit, options)
}
