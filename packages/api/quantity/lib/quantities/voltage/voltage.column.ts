import { QuantityColumnOptions, QuantityColumn } from '#lib/quantity.column.js'
import { VoltageUnit } from './voltage-unit.enum.js'
import { Voltage } from './voltage.js'

export function VoltageColumn (
  storeAsUnit: VoltageUnit,
  options?: QuantityColumnOptions<Voltage>
) {
  return QuantityColumn(Voltage, storeAsUnit, options)
}
