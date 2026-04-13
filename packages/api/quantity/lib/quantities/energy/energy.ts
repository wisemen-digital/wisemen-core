import { Quantity } from '../../quantity.js'
import { EnergyUnit } from './energy-unit.enum.js'

const ENERGY_MULTIPLIERS: Record<EnergyUnit, number> = {
  [EnergyUnit.JOULE]: 1,

  [EnergyUnit.DECIJOULE]: 1e-1,
  [EnergyUnit.CENTIJOULE]: 1e-2,
  [EnergyUnit.MILLIJOULE]: 1e-3,
  [EnergyUnit.MICROJOULE]: 1e-6,
  [EnergyUnit.NANOJOULE]: 1e-9,
  [EnergyUnit.PICOJOULE]: 1e-12,
  [EnergyUnit.FEMTOJOULE]: 1e-15,
  [EnergyUnit.ATTOJOULE]: 1e-18,
  [EnergyUnit.ZEPTOJOULE]: 1e-21,
  [EnergyUnit.YOCTOJOULE]: 1e-24,
  [EnergyUnit.RONTOJOULE]: 1e-27,
  [EnergyUnit.QUECTOJOULE]: 1e-30,

  [EnergyUnit.DECAJOULE]: 1e1,
  [EnergyUnit.HECTOJOULE]: 1e2,
  [EnergyUnit.KILOJOULE]: 1e3,
  [EnergyUnit.MEGAJOULE]: 1e6,
  [EnergyUnit.GIGAJOULE]: 1e9,
  [EnergyUnit.TERAJOULE]: 1e12,
  [EnergyUnit.PETAJOULE]: 1e15,
  [EnergyUnit.EXAJOULE]: 1e18,
  [EnergyUnit.ZETTAJOULE]: 1e21,
  [EnergyUnit.YOTTAJOULE]: 1e24,
  [EnergyUnit.RONNAJOULE]: 1e27,
  [EnergyUnit.QUETAJOULE]: 1e30,

  [EnergyUnit.WATT_HOUR]: 3600,
  [EnergyUnit.KILOWATT_HOUR]: 3600 * 1e3,
  [EnergyUnit.MEGAWATT_HOUR]: 3600 * 1e6,
  [EnergyUnit.GIGAWATT_HOUR]: 3600 * 1e9,
  [EnergyUnit.TERAWATT_HOUR]: 3600 * 1e12,
  [EnergyUnit.PETAWATT_HOUR]: 3600 * 1e15,
  [EnergyUnit.EXAWATT_HOUR]: 3600 * 1e18,
  [EnergyUnit.ZETTAWATT_HOUR]: 3600 * 1e21,
  [EnergyUnit.YOTTAWATT_HOUR]: 3600 * 1e24,
  [EnergyUnit.RONNAWATT_HOUR]: 3600 * 1e27,
  [EnergyUnit.QUETTAWATT_HOUR]: 3600 * 1e30
}

export class Energy extends Quantity<EnergyUnit, Energy> {
  protected baseUnit = EnergyUnit.JOULE

  protected convertValueToBaseUnit (value: number, unit: EnergyUnit): number {
    return value * ENERGY_MULTIPLIERS[unit]
  }

  protected convertBaseUnitValueTo (value: number, unit: EnergyUnit): number {
    return value / ENERGY_MULTIPLIERS[unit]
  }
}
