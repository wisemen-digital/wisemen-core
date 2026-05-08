import type { VoltageUnit } from '@wisemen/quantity'
import {
  Voltage as BaseVoltage,
  VoltageDto,
} from '@wisemen/quantity'

import { formatUnitValue } from '@/models/utils/formatUnit.util'

export class Voltage extends BaseVoltage {
  getValueIn(unit: VoltageUnit): number {
    return this.asNumber(unit)
  }

  toDto(): VoltageDto {
    return VoltageDto.from(this)
  }

  override toString(unit: VoltageUnit = this.unit): string {
    return formatUnitValue(this.getValueIn(unit), unit)
  }
}
