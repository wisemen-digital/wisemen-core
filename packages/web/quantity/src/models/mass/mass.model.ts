import {
  Mass as BaseMass,
  MassDto,
  MassUnit,
} from '@wisemen/quantity'

export class Mass extends BaseMass {
  private getIntlUnit(unit: MassUnit): string {
    switch (unit) {
      case MassUnit.KILOGRAM:
        return 'kilogram'
      case MassUnit.GRAM:
        return 'gram'
      case MassUnit.MILLIGRAM:
        return 'milligram'
      case MassUnit.POUND:
        return 'pound'
      case MassUnit.OUNCE:
        return 'ounce'
      case MassUnit.TONNE:
        return 'ton'
      case MassUnit.DECIGRAM:
        return 'decigram'
      case MassUnit.CENTIGRAM:
        return 'centigram'
      case MassUnit.MICROGRAM:
        return 'microgram'
      case MassUnit.NANOGRAM:
        return 'nanogram'
      case MassUnit.DECAGRAM:
        return 'decagram'
      case MassUnit.HECTOGRAM:
        return 'hectogram'
    }
  }

  getValueIn(unit: MassUnit): number {
    return this.asNumber(unit)
  }

  toDto(): MassDto {
    return MassDto.from(this)
  }

  override toString(unit: MassUnit = this.unit): string {
    return new Intl.NumberFormat(undefined, {
      maximumFractionDigits: 1,
      style: 'unit',
      unit: this.getIntlUnit(unit),
      unitDisplay: 'short',
    }).format(this.getValueIn(unit))
  }
}
