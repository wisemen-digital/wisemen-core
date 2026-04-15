import {
  Power as BasePower,
  PowerDto,
  PowerUnit,
} from '@wisemen/quantity'

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
    const intlUnit = INTL_UNITS[unit]
    const value = this.getValueIn(unit)

    if (intlUnit !== undefined) {
      return new Intl.NumberFormat(undefined, {
        maximumFractionDigits: 1,
        style: 'unit',
        unit: intlUnit,
        unitDisplay: 'short',
      }).format(value)
    }

    return `${new Intl.NumberFormat(undefined, {
      maximumFractionDigits: 1,
    }).format(value)} ${unit}`
  }
}
