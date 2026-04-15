import {
  Speed as BaseSpeed,
  SpeedDto,
  SpeedUnit,
} from '@wisemen/quantity'

export class Speed extends BaseSpeed {
  private getIntlUnit(unit: SpeedUnit): string {
    switch (unit) {
      case SpeedUnit.METER_PER_SECOND:
        return 'meter-per-second'
      case SpeedUnit.KILOMETER_PER_HOUR:
        return 'kilometer-per-hour'
      case SpeedUnit.MILES_PER_HOUR:
        return 'mile-per-hour'
      case SpeedUnit.KNOT:
        return 'knot'
      case SpeedUnit.FOOT_PER_SECOND:
        return 'footPerSecond'
      case SpeedUnit.INCH_PER_SECOND:
        return 'inchPerSecond'
      case SpeedUnit.YARD_PER_SECOND:
        return 'yardPerSecond'
      case SpeedUnit.CENTIMETER_PER_SECOND:
        return 'centimeterPerSecond'
      case SpeedUnit.MILLIMETER_PER_SECOND:
        return 'millimeterPerSecond'
      case SpeedUnit.MICROMETER_PER_SECOND:
        return 'micrometerPerSecond'
    }
  }

  getValueIn(unit: SpeedUnit): number {
    return this.asNumber(unit)
  }

  toDto(): SpeedDto {
    return SpeedDto.from(this)
  }

  override toString(unit: SpeedUnit = this.unit): string {
    return new Intl.NumberFormat(undefined, {
      maximumFractionDigits: 1,
      style: 'unit',
      unit: this.getIntlUnit(unit),
      unitDisplay: 'short',
    }).format(this.getValueIn(unit))
  }
}
