import { QuantityColumn, QuantityColumnOptions } from '../../quantity.column.js'
import { SpeedUnit } from './speed-unit.enum.js'
import { Speed } from './speed.js'

export function SpeedColumn (
  storeAsUnit: SpeedUnit,
  options?: QuantityColumnOptions<SpeedUnit, Speed>
) {
  return QuantityColumn(Speed, storeAsUnit, options)
}
