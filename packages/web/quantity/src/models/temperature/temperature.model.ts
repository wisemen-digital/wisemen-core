import {
  Temperature as BaseTemperature,
  TemperatureDto,
  TemperatureUnit,
} from '@wisemen/quantity'

import { formatUnitValue } from '@/models/utils/formatUnit.util'

const INTL_UNITS: Partial<Record<TemperatureUnit, string>> = {
  [TemperatureUnit.CELSIUS]: 'celsius',
  [TemperatureUnit.FAHRENHEIT]: 'fahrenheit',
  [TemperatureUnit.KELVIN]: 'kelvin',
}

export class Temperature extends BaseTemperature {
  getValueIn(unit: TemperatureUnit): number {
    return this.asNumber(unit)
  }

  toDto(): TemperatureDto {
    return TemperatureDto.from(this)
  }

  override toString(unit: TemperatureUnit = this.unit): string {
    return formatUnitValue(this.getValueIn(unit), unit, INTL_UNITS[unit])
  }
}
