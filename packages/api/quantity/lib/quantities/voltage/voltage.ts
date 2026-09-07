import { ScalableQuantity } from '#lib/quantity.js'
import { VoltageUnit } from './voltage-unit.enum.js'

const VOLTAGE_MULTIPLIERS: Record<VoltageUnit, number> = {
  [VoltageUnit.VOLT]: 1,
  [VoltageUnit.MILLIVOLT]: 1e-3,
  [VoltageUnit.KILOVOLT]: 1e3
}

export class Voltage extends ScalableQuantity<VoltageUnit, Voltage, Voltage> {
  protected getQuantity() {
    return Voltage
  }

  protected getDelta() {
    return Voltage
  }

  protected getBaseUnit () {
    return VoltageUnit.VOLT
  }

  protected getUnits (): readonly VoltageUnit[] {
    return Object.values(VoltageUnit)
  }

  protected convertValueToBaseUnit (value: number, fromUnit: VoltageUnit): number {
    return value * VOLTAGE_MULTIPLIERS[fromUnit]
  }

  protected convertBaseUnitValueTo (value: number, toUnit: VoltageUnit): number {
    return value / VOLTAGE_MULTIPLIERS[toUnit]
  }

  get volts (): number {
    return this.asNumber(VoltageUnit.VOLT)
  }

  static ZERO = new Voltage(0, VoltageUnit.VOLT)
}
