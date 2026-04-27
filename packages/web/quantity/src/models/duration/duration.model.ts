import {
  Duration as BaseDuration,
  DurationDto,
  DurationUnit,
} from '@wisemen/quantity'

import { formatUnitValue } from '@/models/utils/formatUnit.util'

const INTL_UNITS: Partial<Record<DurationUnit, string>> = {
  [DurationUnit.DAYS]: 'day',
  [DurationUnit.HOURS]: 'hour',
  [DurationUnit.MICROSECONDS]: 'microsecond',
  [DurationUnit.MILLISECONDS]: 'millisecond',
  [DurationUnit.MINUTES]: 'minute',
  [DurationUnit.NANOSECONDS]: 'nanosecond',
  [DurationUnit.SECONDS]: 'second',
}

export class Duration extends BaseDuration {
  getValueIn(unit: DurationUnit): number {
    return this.asNumber(unit)
  }

  toDto(): DurationDto {
    return DurationDto.from(this)
  }

  override toString(unit: DurationUnit = this.unit): string {
    return formatUnitValue(this.getValueIn(unit), unit, INTL_UNITS[unit])
  }
}
