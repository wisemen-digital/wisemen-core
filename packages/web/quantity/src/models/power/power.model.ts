import {
  Power as BasePower,
  PowerDto,
  PowerUnit,
} from '@wisemen/quantity'

import { formatUnitValue } from '@/models/utils/formatUnit.util'

const INTL_UNITS: Partial<Record<PowerUnit, string>> = {
  [PowerUnit.KILOWATT]: 'kilowatt',
  [PowerUnit.WATT]: 'watt',
}

export class Power extends BasePower {
  getValueIn(unit: PowerUnit): number {
    return this.asNumber(unit)
  }

  toDto(): PowerDto {
    return PowerDto.from(this)
  }

  override toString(unit: PowerUnit = this.unit): string {
    const value = this.getValueIn(unit)

    return formatUnitValue(value, unit, INTL_UNITS[unit])
  }
}
