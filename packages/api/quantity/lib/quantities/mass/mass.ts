import { Quantity } from '../../quantity.js'
import { MassUnit } from './mass-unit.enum.js'

const MASS_MULTIPLIERS: Record<MassUnit, number> = {
  [MassUnit.KILOGRAM]: 1,

  [MassUnit.GRAM]: 1e-3,
  [MassUnit.DECIGRAM]: 1e-4,
  [MassUnit.CENTIGRAM]: 1e-5,
  [MassUnit.MILLIGRAM]: 1e-6,
  [MassUnit.MICROGRAM]: 1e-9,
  [MassUnit.NANOGRAM]: 1e-12,

  [MassUnit.DECAGRAM]: 1e-2,
  [MassUnit.HECTOGRAM]: 1e-1,

  [MassUnit.TONNE]: 1e3,

  [MassUnit.POUND]: 0.45359237,
  [MassUnit.OUNCE]: 0.028349523125
}

export class Mass extends Quantity<MassUnit, Mass> {
  protected baseUnit = MassUnit.KILOGRAM

  protected convertValueToBaseUnit (value: number, fromUnit: MassUnit): number {
    return value * MASS_MULTIPLIERS[fromUnit]
  }

  protected convertBaseUnitValueTo (value: number, toUnit: MassUnit): number {
    return value / MASS_MULTIPLIERS[toUnit]
  }

  get kilograms (): number {
    return this.asNumber(MassUnit.KILOGRAM)
  }

  get grams (): number {
    return this.asNumber(MassUnit.GRAM)
  }
}
