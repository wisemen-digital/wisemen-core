import { Distance } from '../../quantities/distance/distance.js'
import { DistanceUnit } from '../../quantities/distance/distance-unit.enum.js'
import { Volume } from '../../quantities/volume/volume.js'
import { VolumeUnit } from '../../quantities/volume/volume-unit.enum.js'
import { Rate } from '../../rate/rate.js'
import { ScalableQuantity } from '../../quantity.js'
import { AreaUnit } from './area-unit.enum.js'

const AREA_MULTIPLIERS: Record<AreaUnit, number> = {
  [AreaUnit.SQUARE_METER]: 1,

  [AreaUnit.SQUARE_DECIMETER]: 1e-2,
  [AreaUnit.SQUARE_CENTIMETER]: 1e-4,
  [AreaUnit.SQUARE_MILLIMETER]: 1e-6,

  [AreaUnit.SQUARE_KILOMETER]: 1e6,
  [AreaUnit.HECTARE]: 1e4,

  [AreaUnit.SQUARE_INCH]: 0.0254 ** 2,
  [AreaUnit.SQUARE_FOOT]: 0.3048 ** 2,
  [AreaUnit.SQUARE_YARD]: 0.9144 ** 2,
  [AreaUnit.ACRE]: 4046.8564224,
  [AreaUnit.SQUARE_MILE]: 1609.34 ** 2
}

export class Area extends ScalableQuantity<AreaUnit, Area, Area> {
  protected getQuantity () {
    return Area
  }

  protected getDelta () {
    return Area
  }

  protected getBaseUnit () {
    return AreaUnit.SQUARE_METER
  }

  protected getUnits (): readonly AreaUnit[] {
    return Object.values(AreaUnit)
  }

  protected convertValueToBaseUnit (value: number, unit: AreaUnit): number {
    return value * AREA_MULTIPLIERS[unit]
  }

  protected convertBaseUnitValueTo (value: number, unit: AreaUnit): number {
    return value / AREA_MULTIPLIERS[unit]
  }

  get squareMeters (): number {
    return this.asNumber(AreaUnit.SQUARE_METER)
  }

  get squareKilometers (): number {
    return this.asNumber(AreaUnit.SQUARE_KILOMETER)
  }

  static ZERO = new Area(0, AreaUnit.SQUARE_METER)

  override multiply (distance: Distance): Volume
  override multiply (scalar: number): Area
  override multiply (rate: Rate): Area
  override multiply (multiplier: number | Rate | Distance): Area | Volume {
    if (multiplier instanceof Distance) {
      return new Volume(this.valueOf() * multiplier.valueOf(), VolumeUnit.CUBIC_METER)
    }

    return super.multiply(multiplier)
  }

  override divide (scalar: number): Area
  override divide (rate: Rate): Area
  override divide (value: number, unit: AreaUnit): number
  override divide (area: Area): number
  override divide (distance: Distance): Distance
  override divide (divisor: number | Rate | Area | Distance, unit?: AreaUnit): Area | Distance | number {
    if (divisor instanceof Distance) {
      return new Distance(this.valueOf() / divisor.valueOf(), DistanceUnit.METER)
    }

    return super.divide(divisor, unit)
  }
}
