import { Area } from '../../quantities/area/area.js'
import { AreaUnit } from '../../quantities/area/area-unit.enum.js'
import { Distance } from '../../quantities/distance/distance.js'
import { DistanceUnit } from '../../quantities/distance/distance-unit.enum.js'
import { Rate } from '../../rate/rate.js'
import { ScalableQuantity } from '../../quantity.js'
import { VolumeUnit } from './volume-unit.enum.js'

const VOLUME_MULTIPLIERS: Record<VolumeUnit, number> = {
  [VolumeUnit.CUBIC_METER]: 1,

  [VolumeUnit.CUBIC_DECIMETER]: 1e-3,
  [VolumeUnit.CUBIC_CENTIMETER]: 1e-6,
  [VolumeUnit.CUBIC_MILLIMETER]: 1e-9,
  [VolumeUnit.CUBIC_KILOMETER]: 1e9,

  [VolumeUnit.LITER]: 1e-3,
  [VolumeUnit.MILLILITER]: 1e-6,

  [VolumeUnit.CUBIC_INCH]: 0.0254 ** 3,
  [VolumeUnit.CUBIC_FOOT]: 0.3048 ** 3,
  [VolumeUnit.CUBIC_YARD]: 0.9144 ** 3,
  [VolumeUnit.US_GALLON]: 0.003785411784,
  [VolumeUnit.CUBIC_MILE]: 1609.34 ** 3
}

export class Volume extends ScalableQuantity<VolumeUnit, Volume, Volume> {
  protected getQuantity () {
    return Volume
  }

  protected getDelta () {
    return Volume
  }

  protected getBaseUnit () {
    return VolumeUnit.CUBIC_METER
  }

  protected getUnits (): readonly VolumeUnit[] {
    return Object.values(VolumeUnit)
  }

  protected convertValueToBaseUnit (value: number, unit: VolumeUnit): number {
    return value * VOLUME_MULTIPLIERS[unit]
  }

  protected convertBaseUnitValueTo (value: number, unit: VolumeUnit): number {
    return value / VOLUME_MULTIPLIERS[unit]
  }

  get cubicMeters (): number {
    return this.asNumber(VolumeUnit.CUBIC_METER)
  }

  get liters (): number {
    return this.asNumber(VolumeUnit.LITER)
  }

  static ZERO = new Volume(0, VolumeUnit.CUBIC_METER)

  override divide (scalar: number): Volume
  override divide (rate: Rate): Volume
  override divide (value: number, unit: VolumeUnit): number
  override divide (volume: Volume): number
  override divide (distance: Distance): Area
  override divide (area: Area): Distance
  override divide (divisor: number | Rate | Volume | Distance | Area, unit?: VolumeUnit): Volume | Area | Distance | number {
    if (divisor instanceof Distance) {
      return new Area(this.valueOf() / divisor.valueOf(), AreaUnit.SQUARE_METER)
    }
    if (divisor instanceof Area) {
      return new Distance(this.valueOf() / divisor.valueOf(), DistanceUnit.METER)
    }

    return super.divide(divisor, unit)
  }
}
