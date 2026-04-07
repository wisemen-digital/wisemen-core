import { QuantityColumnOptions, QuantityColumn } from '../../quantity.column.js'
import { VoltageUnit } from './voltage-unit.enum.js'
import { Voltage } from './voltage.js'

export function VoltageColumn (
  storeAsUnit: VoltageUnit,
  options?: QuantityColumnOptions<VoltageUnit, Voltage>
) {
  return QuantityColumn(Voltage, storeAsUnit, options)
}
