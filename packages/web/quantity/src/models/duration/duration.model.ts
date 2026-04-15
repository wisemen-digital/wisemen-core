import {
  Duration as BaseDuration,
  DurationDto,
  DurationUnit,
} from '@wisemen/quantity'

export class Duration extends BaseDuration {
  private getIntlUnit(unit: DurationUnit): string {
    switch (unit) {
      case DurationUnit.SECONDS:
        return 'second'
      case DurationUnit.MILLISECONDS:
        return 'millisecond'
      case DurationUnit.MICROSECONDS:
        return 'microsecond'
      case DurationUnit.NANOSECONDS:
        return 'nanosecond'
      case DurationUnit.MINUTES:
        return 'minute'
      case DurationUnit.HOURS:
        return 'hour'
      case DurationUnit.DAYS:
        return 'day'
    }
  }

  getValueIn(unit: DurationUnit): number {
    return this.asNumber(unit)
  }

  toDto(): DurationDto {
    return DurationDto.from(this)
  }

  override toString(unit: DurationUnit = this.unit): string {
    return new Intl.NumberFormat(undefined, {
      maximumFractionDigits: 1,
      style: 'unit',
      unit: this.getIntlUnit(unit),
      unitDisplay: 'short',
    }).format(this.getValueIn(unit))
  }
}
