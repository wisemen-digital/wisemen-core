import {
  Energy as BaseEnergy,
  EnergyDto,
  EnergyUnit,
} from '@wisemen/quantity'

import { formatUnitValue } from '@/models/utils/formatUnit.util'

const INTL_UNITS: Partial<Record<EnergyUnit, string>> = {
  [EnergyUnit.JOULE]: 'joule',
  [EnergyUnit.KILOJOULE]: 'kilojoule',
  [EnergyUnit.KILOWATT_HOUR]: 'kilowatt-hour',
}

export class Energy extends BaseEnergy {
  getValueIn(unit: EnergyUnit): number {
    return this.asNumber(unit)
  }

  toDto(): EnergyDto {
    return EnergyDto.from(this)
  }

  override toString(unit: EnergyUnit = this.unit): string {
    const value = this.getValueIn(unit)

    return formatUnitValue(value, unit, INTL_UNITS[unit])
  }
}
