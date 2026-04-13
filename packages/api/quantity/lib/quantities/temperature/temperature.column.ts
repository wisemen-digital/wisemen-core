import { ColumnOptions } from 'typeorm'
import { QuantityColumn } from '../../quantity.column.js'
import { Temperature } from './temperature.js'
import { TemperatureUnit } from './temperature-unit.enum.js'

export function TemperatureColumn (
  storeAsUnit: TemperatureUnit,
  options?: Omit<ColumnOptions, 'type' | 'transformer'>
) {
  return QuantityColumn(Temperature, storeAsUnit, options)
}
