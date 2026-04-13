import { Quantity } from '../../quantity.js'
import { DistanceUnit } from './distance-unit.enum.js'

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

export class Distance extends Quantity<DistanceUnit, Distance> {
  protected baseUnit = DistanceUnit.METER

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
}
