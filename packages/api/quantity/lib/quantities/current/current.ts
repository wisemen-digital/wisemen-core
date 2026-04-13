import { Quantity } from '../../quantity.js'
import { CurrentUnit } from './current-unit.enum.js'

export const CURRENT_MULTIPLIERS: Record<CurrentUnit, number> = {
  [CurrentUnit.AMPERE]: 1,

  [CurrentUnit.DECIAMPERE]: 1e-1,
  [CurrentUnit.CENTIAMPERE]: 1e-2,
  [CurrentUnit.MILLIAMPERE]: 1e-3,
  [CurrentUnit.MICROAMPERE]: 1e-6,
  [CurrentUnit.NANOAMPERE]: 1e-9,
  [CurrentUnit.PICOAMPERE]: 1e-12,
  [CurrentUnit.FEMTOAMPERE]: 1e-15,
  [CurrentUnit.ATTOAMPERE]: 1e-18,
  [CurrentUnit.ZEPTOAMPERE]: 1e-21,
  [CurrentUnit.YOCTOAMPERE]: 1e-24,
  [CurrentUnit.RONTOAMPERE]: 1e-27,
  [CurrentUnit.QUECTOAMPERE]: 1e-30,

  [CurrentUnit.DECAAMPERE]: 1e1,
  [CurrentUnit.HECTOAMPERE]: 1e2,
  [CurrentUnit.KILOAMPERE]: 1e3,
  [CurrentUnit.MEGAAMPERE]: 1e6,
  [CurrentUnit.GIGAAMPERE]: 1e9,
  [CurrentUnit.TERAAMPERE]: 1e12,
  [CurrentUnit.PETAAMPERE]: 1e15,
  [CurrentUnit.EXAAMPERE]: 1e18,
  [CurrentUnit.ZETTAAMPERE]: 1e21,
  [CurrentUnit.YOTTAAMPERE]: 1e24,
  [CurrentUnit.RONNAAMPERE]: 1e27,
  [CurrentUnit.QUETTAAMPERE]: 1e30
}

export class Current extends Quantity<CurrentUnit, Current> {
  protected baseUnit = CurrentUnit.AMPERE

  protected convertValueToBaseUnit (value: number, unit: CurrentUnit): number {
    return value * CURRENT_MULTIPLIERS[unit]
  }

  protected convertBaseUnitValueTo (value: number, unit: CurrentUnit): number {
    return value / CURRENT_MULTIPLIERS[unit]
  }
}
