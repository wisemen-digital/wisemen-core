import { Duration } from '../../quantities/duration/duration.js'
import { PowerUnit } from '../../quantities/power/power-unit.enum.js'
import { Power } from '../../quantities/power/power.js'
import { Rate } from '../../rate/rate.js'
import { ScalableQuantity } from '../../quantity.js'
import { EnergyUnit } from './energy-unit.enum.js'
import { DurationUnit } from '#src/quantities/duration/duration-unit.enum.js'

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
  [EnergyUnit.QUETTAWATT_HOUR]: 3600 * 1e30,

  // Thermochemical calorie: 1 cal = 4.184 J
  [EnergyUnit.CALORIE]: 4.184,
  [EnergyUnit.KILOCALORIE]: 4184
}

export class Energy extends ScalableQuantity<EnergyUnit, Energy, Energy> {
  protected getQuantity() {
    return Energy
  }

  protected getDelta() {
    return Energy
  }

  protected getBaseUnit () {
    return EnergyUnit.JOULE
  }

  protected getUnits (): readonly EnergyUnit[] {
    return Object.values(EnergyUnit)
  }

  protected convertValueToBaseUnit (value: number, unit: EnergyUnit): number {
    return value * ENERGY_MULTIPLIERS[unit]
  }

  protected convertBaseUnitValueTo (value: number, unit: EnergyUnit): number {
    return value / ENERGY_MULTIPLIERS[unit]
  }

  static ZERO = new Energy(0, EnergyUnit.JOULE)

  override divide(divisor: number): Energy
  override divide(rate: Rate): Energy
  override divide(value: number, unit: EnergyUnit): number
  override divide(energy: Energy): number
  override divide(duration: Duration): Power
  override divide(power: Power): Duration
  override divide(divisor: number | Rate | Energy | Duration | Power, unit?: EnergyUnit): Energy | Power | Duration | number {
    if (divisor instanceof Duration) {
      return new Power(this.valueOf() / divisor.valueOf(), PowerUnit.WATT)
    }
    if (divisor instanceof Power) {
      return new Duration(this.valueOf() / divisor.valueOf(), DurationUnit.SECONDS)
    }
    return super.divide(divisor, unit)
  }
}
