import type { VoltageUnit } from '@wisemen/quantity'
import {
  Voltage as BaseVoltage,
  VoltageDto,
} from '@wisemen/quantity'

export class Voltage extends BaseVoltage {
  getValueIn(unit: VoltageUnit): number {
    return this.asNumber(unit)
  }

  toDto(): VoltageDto {
    return VoltageDto.from(this)
  }

  override toString(unit: VoltageUnit = this.unit): string {
    return `${new Intl.NumberFormat(undefined, {
      maximumFractionDigits: 1,
    }).format(this.getValueIn(unit))} ${unit}`
  }
}
