import { Area } from '#lib/quantities/area/area.js'
import { AreaUnit } from '#lib/quantities/area/area-unit.enum.js'
import { Volume } from '#lib/quantities/volume/volume.js'
import { VolumeUnit } from '#lib/quantities/volume/volume-unit.enum.js'
import { Duration } from '#lib/quantities/duration/duration.js'
import { SpeedUnit } from '#lib/quantities/speed/speed-unit.enum.js'
import { Speed } from '#lib/quantities/speed/speed.js'
import { Rate } from '#lib/rate/rate.js'
import { ScalableQuantity } from '#lib/quantity.js'
import { DistanceUnit } from './distance-unit.enum.js'
import { DurationUnit } from '#lib/quantities/duration/duration-unit.enum.js'

const DISTANCE_MULTIPLIERS: Record<DistanceUnit, number> = {
  [DistanceUnit.METER]: 1,

  [DistanceUnit.DECIMETER]: 1e-1,
  [DistanceUnit.CENTIMETER]: 1e-2,
  [DistanceUnit.MILLIMETER]: 1e-3,
  [DistanceUnit.MICROMETER]: 1e-6,
  [DistanceUnit.NANOMETER]: 1e-9,

  [DistanceUnit.DECAMETER]: 1e1,
  [DistanceUnit.HECTOMETER]: 1e2,
  [DistanceUnit.KILOMETER]: 1e3,

  [DistanceUnit.INCH]: 0.0254,
  [DistanceUnit.FOOT]: 0.3048,
  [DistanceUnit.YARD]: 0.9144,
  [DistanceUnit.MILES]: 1609.34
}

export class Distance extends ScalableQuantity<DistanceUnit, Distance, Distance> {
  protected getQuantity() {
    return Distance
  }

  protected getDelta() {
    return Distance
  }

  protected getBaseUnit () {
    return DistanceUnit.METER
  }

  protected getUnits (): readonly DistanceUnit[] {
    return Object.values(DistanceUnit)
  }

  protected convertValueToBaseUnit (value: number, fromUnit: DistanceUnit): number {
    return value * DISTANCE_MULTIPLIERS[fromUnit]
  }

  protected convertBaseUnitValueTo (value: number, toUnit: DistanceUnit): number {
    return value / DISTANCE_MULTIPLIERS[toUnit]
  }

  get meters (): number {
    return this.asNumber(DistanceUnit.METER)
  }

  get kilometers (): number {
    return this.asNumber(DistanceUnit.KILOMETER)
  }

  static ZERO = new Distance(0, DistanceUnit.METER)

  override multiply(distance: Distance): Area
  override multiply(area: Area): Volume
  override multiply(scalar: number): Distance
  override multiply(rate: Rate): Distance
  override multiply(multiplier: number | Rate | Distance | Area): Distance | Area | Volume {
    if (multiplier instanceof Distance) {
      return new Area(this.valueOf() * multiplier.valueOf(), AreaUnit.SQUARE_METER)
    }
    if (multiplier instanceof Area) {
      return new Volume(this.valueOf() * multiplier.valueOf(), VolumeUnit.CUBIC_METER)
    }

    return super.multiply(multiplier)
  }

  override divide(scalar: number): Distance
  override divide(rate: Rate): Distance
  override divide(value: number, unit: DistanceUnit): number
  override divide(distance: Distance): number
  override divide(duration: Duration): Speed
  override divide(speed: Speed): Duration
  override divide(divisor: number | Rate | Distance | Duration | Speed, unit?: DistanceUnit): Distance | Speed | Duration | number {
    if (divisor instanceof Duration) {
      return new Speed(this.valueOf() / divisor.valueOf(), SpeedUnit.METER_PER_SECOND)
    }
    if (divisor instanceof Speed) {
      return new Duration(this.valueOf() / divisor.valueOf(), DurationUnit.SECONDS)
    }
    return super.divide(divisor, unit)
  }
}
