import { Quantity } from '../../quantity.js'
import { PowerUnit } from './power-unit.enum.js'

const POWER_MULTIPLIERS: Record<PowerUnit, number> = {
  [PowerUnit.WATT]: 1,

  [PowerUnit.DECIWATT]: 1e-1,
  [PowerUnit.CENTIWATT]: 1e-2,
  [PowerUnit.MILLIWATT]: 1e-3,
  [PowerUnit.MICROWATT]: 1e-6,
  [PowerUnit.NANOWATT]: 1e-9,
  [PowerUnit.PICOWATT]: 1e-12,
  [PowerUnit.FEMTOWATT]: 1e-15,
  [PowerUnit.ATTOWATT]: 1e-18,
  [PowerUnit.ZEPTOWATT]: 1e-21,
  [PowerUnit.YOCTOWATT]: 1e-24,
  [PowerUnit.RONTOWATT]: 1e-27,
  [PowerUnit.QUECTOWATT]: 1e-30,

  [PowerUnit.DECAWATT]: 1e1,
  [PowerUnit.HECTOWATT]: 1e2,
  [PowerUnit.KILOWATT]: 1e3,
  [PowerUnit.MEGAWATT]: 1e6,
  [PowerUnit.GIGAWATT]: 1e9,
  [PowerUnit.TERAWATT]: 1e12,
  [PowerUnit.PETAWATT]: 1e15,
  [PowerUnit.EXAWATT]: 1e18,
  [PowerUnit.ZETTAWATT]: 1e21,
  [PowerUnit.YOTTAWATT]: 1e24,
  [PowerUnit.RONNAWATT]: 1e27,
  [PowerUnit.QUETTAWATT]: 1e30
}

export class Power extends Quantity<PowerUnit, Power> {
  protected baseUnit = PowerUnit.WATT

  protected convertValueToBaseUnit (value: number, unit: PowerUnit): number {
    return value * POWER_MULTIPLIERS[unit]
  }

  protected convertBaseUnitValueTo (value: number, unit: PowerUnit): number {
    return value / POWER_MULTIPLIERS[unit]
  }
}
