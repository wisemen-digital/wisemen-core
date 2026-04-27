import {
  Distance as BaseDistance,
  DistanceDto,
  DistanceUnit,
} from '@wisemen/quantity'

import { formatUnitValue } from '@/models/utils/formatUnit.util'

const INTL_UNITS: Partial<Record<DistanceUnit, string>> = {
  [DistanceUnit.CENTIMETER]: 'centimeter',
  [DistanceUnit.DECAMETER]: 'decameter',
  [DistanceUnit.DECIMETER]: 'decimeter',
  [DistanceUnit.FOOT]: 'foot',
  [DistanceUnit.HECTOMETER]: 'hectometer',
  [DistanceUnit.INCH]: 'inch',
  [DistanceUnit.KILOMETER]: 'kilometer',
  [DistanceUnit.METER]: 'meter',
  [DistanceUnit.MICROMETER]: 'micrometer',
  [DistanceUnit.MILES]: 'mile',
  [DistanceUnit.MILLIMETER]: 'millimeter',
  [DistanceUnit.NANOMETER]: 'nanometer',
  [DistanceUnit.YARD]: 'yard',
}

export class Distance extends BaseDistance {
  getValueIn(unit: DistanceUnit): number {
    return this.asNumber(unit)
  }

  toDto(): DistanceDto {
    return DistanceDto.from(this)
  }

  override toString(unit: DistanceUnit = this.unit): string {
    return formatUnitValue(this.getValueIn(unit), unit, INTL_UNITS[unit])
  }
}
