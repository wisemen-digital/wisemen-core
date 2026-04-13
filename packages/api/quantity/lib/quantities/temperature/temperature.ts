import { Quantity } from '../../quantity.js'
import { TemperatureUnit } from './temperature-unit.enum.js'

export class Temperature extends Quantity<TemperatureUnit, Temperature> {
  protected baseUnit = TemperatureUnit.KELVIN

  protected convertValueToBaseUnit (value: number, unit: TemperatureUnit): number {
    switch (unit) {
      case TemperatureUnit.KELVIN:
        return value
      case TemperatureUnit.CELSIUS:
        return value + 273.15
      case TemperatureUnit.FAHRENHEIT:
        return ((value - 32) * 5) / 9 + 273.15
      case TemperatureUnit.MILLI_DEGREE_CELSIUS:
        return (value / 1000) + 273.15
    }
  }

  protected convertBaseUnitValueTo (value: number, unit: TemperatureUnit): number {
    switch (unit) {
      case TemperatureUnit.KELVIN:
        return value
      case TemperatureUnit.CELSIUS:
        return value - 273.15
      case TemperatureUnit.FAHRENHEIT:
        return ((value - 273.15) * 9) / 5 + 32
      case TemperatureUnit.MILLI_DEGREE_CELSIUS:
        return (value - 273.15) * 1000
    }
  }
}
