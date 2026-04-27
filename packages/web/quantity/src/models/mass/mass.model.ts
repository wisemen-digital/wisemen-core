import {
  Mass as BaseMass,
  MassDto,
  MassUnit,
} from '@wisemen/quantity'

import { formatUnitValue } from '@/models/utils/formatUnit.util'

const INTL_UNITS: Partial<Record<MassUnit, string>> = {
  [MassUnit.CENTIGRAM]: 'centigram',
  [MassUnit.DECAGRAM]: 'decagram',
  [MassUnit.DECIGRAM]: 'decigram',
  [MassUnit.GRAM]: 'gram',
  [MassUnit.HECTOGRAM]: 'hectogram',
  [MassUnit.KILOGRAM]: 'kilogram',
  [MassUnit.MICROGRAM]: 'microgram',
  [MassUnit.MILLIGRAM]: 'milligram',
  [MassUnit.NANOGRAM]: 'nanogram',
  [MassUnit.OUNCE]: 'ounce',
  [MassUnit.POUND]: 'pound',
  [MassUnit.TONNE]: 'ton',
}

export class Mass extends BaseMass {
  getValueIn(unit: MassUnit): number {
    return this.asNumber(unit)
  }

  toDto(): MassDto {
    return MassDto.from(this)
  }

  override toString(unit: MassUnit = this.unit): string {
    return formatUnitValue(this.getValueIn(unit), unit, INTL_UNITS[unit])
  }
}
