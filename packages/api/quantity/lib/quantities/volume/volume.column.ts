import { QuantityColumn, QuantityColumnOptions } from '../../quantity.column.js'
import { Volume } from './volume.js'
import { VolumeUnit } from './volume-unit.enum.js'

export function VolumeColumn (
  storeAsUnit: VolumeUnit,
  options?: QuantityColumnOptions<Volume>
) {
  return QuantityColumn(Volume, storeAsUnit, options)
}
