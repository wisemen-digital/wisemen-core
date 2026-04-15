import { TemperatureDto, TemperatureUnit, Temperature as BaseTemperature } from '@wisemen/quantity'


export class Temperature extends BaseTemperature {
  private getIntlUnit(unit: TemperatureUnit): string {
    switch (unit) {
      case TemperatureUnit.CELSIUS:
        return 'celsius'
      case TemperatureUnit.FAHRENHEIT:
        return 'fahrenheit'
      case TemperatureUnit.KELVIN:
        return 'kelvin'
      case TemperatureUnit.MILLI_DEGREE_CELSIUS:
        return 'milliCelsius'
    }
  }

  getValueIn(unit: TemperatureUnit): number {
    return this.asNumber(unit)
  }

  toDto(): TemperatureDto {
    return TemperatureDto.from(this)
  }

  override toString(unit: TemperatureUnit = this.unit): string {
    return new Intl.NumberFormat(undefined, {
      maximumFractionDigits: 1,
      style: 'unit',
      unit: this.getIntlUnit(unit),
      unitDisplay: 'short',
    }).format(this.getValueIn(unit))
  }
  
}