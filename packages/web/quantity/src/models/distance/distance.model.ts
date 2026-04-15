import {
  Distance as BaseDistance,
  DistanceDto,
  DistanceUnit,
} from '@wisemen/quantity'

export class Distance extends BaseDistance {
  private getIntlUnit(unit: DistanceUnit): string {
    switch (unit) {
      case DistanceUnit.METER:
        return 'meter'
      case DistanceUnit.DECIMETER:
        return 'decimeter'
      case DistanceUnit.CENTIMETER:
        return 'centimeter'
      case DistanceUnit.MILLIMETER:
        return 'millimeter'
      case DistanceUnit.MICROMETER:
        return 'micrometer'
      case DistanceUnit.NANOMETER:
        return 'nanometer'
      case DistanceUnit.DECAMETER:
        return 'decameter'
      case DistanceUnit.HECTOMETER:
        return 'hectometer'
      case DistanceUnit.KILOMETER:
        return 'kilometer'
      case DistanceUnit.MILES:
        return 'mile'
      case DistanceUnit.INCH:
        return 'inch'
      case DistanceUnit.FOOT:
        return 'foot'
      case DistanceUnit.YARD:
        return 'yard'
    }
  }

  getValueIn(unit: DistanceUnit): number {
    return this.asNumber(unit)
  }

  toDto(): DistanceDto {
    return DistanceDto.from(this)
  }

  override toString(unit: DistanceUnit = this.unit): string {
    return new Intl.NumberFormat(undefined, {
      maximumFractionDigits: 1,
      style: 'unit',
      unit: this.getIntlUnit(unit),
      unitDisplay: 'short',
    }).format(this.getValueIn(unit))
  }
}
