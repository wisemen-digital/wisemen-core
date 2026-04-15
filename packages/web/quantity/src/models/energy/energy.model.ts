import {
  Energy as BaseEnergy,
  EnergyDto,
  EnergyUnit,
} from '@wisemen/quantity'

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
