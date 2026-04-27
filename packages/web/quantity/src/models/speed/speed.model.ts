import {
  Speed as BaseSpeed,
  SpeedDto,
  SpeedUnit,
} from '@wisemen/quantity'

import { formatUnitValue } from '@/models/utils/formatUnit.util'

const INTL_UNITS: Partial<Record<SpeedUnit, string>> = {
  [SpeedUnit.KILOMETER_PER_HOUR]: 'kilometer-per-hour',
  [SpeedUnit.KNOT]: 'knot',
  [SpeedUnit.METER_PER_SECOND]: 'meter-per-second',
  [SpeedUnit.MILES_PER_HOUR]: 'mile-per-hour',
}

export class Speed extends BaseSpeed {
  getValueIn(unit: SpeedUnit): number {
    return this.asNumber(unit)
  }

  toDto(): SpeedDto {
    return SpeedDto.from(this)
  }

  override toString(unit: SpeedUnit = this.unit): string {
    return formatUnitValue(this.getValueIn(unit), unit, INTL_UNITS[unit])
  }
}
