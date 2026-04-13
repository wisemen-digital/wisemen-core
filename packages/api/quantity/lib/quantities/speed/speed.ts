import { Quantity } from '../../quantity.js'
import { SpeedUnit } from './speed-unit.enum.js'

const SPEED_MULTIPLIERS: Record<SpeedUnit, number> = {
  [SpeedUnit.METER_PER_SECOND]: 1,

  [SpeedUnit.KILOMETER_PER_HOUR]: 1 / 3.6,
  [SpeedUnit.MILES_PER_HOUR]: 0.44704,
  [SpeedUnit.KNOT]: 0.514444,
  [SpeedUnit.FOOT_PER_SECOND]: 0.3048,
  [SpeedUnit.INCH_PER_SECOND]: 0.0254,
  [SpeedUnit.YARD_PER_SECOND]: 0.9144,
  [SpeedUnit.CENTIMETER_PER_SECOND]: 0.01,
  [SpeedUnit.MILLIMETER_PER_SECOND]: 0.001,
  [SpeedUnit.MICROMETER_PER_SECOND]: 1e-6
}

export class Speed extends Quantity<SpeedUnit, Speed> {
  protected baseUnit = SpeedUnit.METER_PER_SECOND

  protected convertValueToBaseUnit (value: number, fromUnit: SpeedUnit): number {
    return value * SPEED_MULTIPLIERS[fromUnit]
  }

  protected convertBaseUnitValueTo (value: number, toUnit: SpeedUnit): number {
    return value / SPEED_MULTIPLIERS[toUnit]
  }
}
