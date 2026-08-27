import { QuantityColumn, QuantityColumnOptions } from '../../quantity.column.js'
import { Energy } from './energy.js'
import { EnergyUnit } from './energy-unit.enum.js'

export function EnergyColumn (
  storeAsUnit: EnergyUnit,
  options?: QuantityColumnOptions<Energy>
) {
  return QuantityColumn(Energy, storeAsUnit, options)
}
