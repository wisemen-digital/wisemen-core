import { BaseQuantity, ScalableQuantity } from '#lib/quantity.js'
import { TemperatureUnit } from './temperature-unit.enum.js'

export class TemperatureDelta extends ScalableQuantity<TemperatureUnit, TemperatureDelta, TemperatureDelta> {
  protected getQuantity() {
    return TemperatureDelta
  }

  protected getDelta() {
    return TemperatureDelta
  }

  protected getBaseUnit () {
    return TemperatureUnit.KELVIN
  }

  protected getUnits (): readonly TemperatureUnit[] {
    return Object.values(TemperatureUnit)
  }

  protected convertValueToBaseUnit (value: number, unit: TemperatureUnit): number {
    switch (unit) {
      case TemperatureUnit.KELVIN:
      case TemperatureUnit.CELSIUS:
        return value
      case TemperatureUnit.FAHRENHEIT:
        return value * 5 / 9
      case TemperatureUnit.MILLI_DEGREE_CELSIUS:
        return value / 1000
    }
  }

  protected convertBaseUnitValueTo (value: number, unit: TemperatureUnit): number {
    switch (unit) {
      case TemperatureUnit.KELVIN:
      case TemperatureUnit.CELSIUS:
        return value
      case TemperatureUnit.FAHRENHEIT:
        return value * 9 / 5
      case TemperatureUnit.MILLI_DEGREE_CELSIUS:
        return value * 1000
    }
  }

  static ZERO = new TemperatureDelta(0, TemperatureUnit.KELVIN)
}

export class Temperature extends BaseQuantity<TemperatureUnit, Temperature, TemperatureDelta> {
  protected getQuantity() {
    return Temperature
  }

  protected getDelta() {
    return TemperatureDelta
  }

  protected getBaseUnit () {
    return TemperatureUnit.KELVIN
  }

  protected getUnits (): readonly TemperatureUnit[] {
    return Object.values(TemperatureUnit)
  }

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

  /** Absolute zero = 0 Kelvin. NOTE: this does NOT represent 0° Celsius or Fahrenheit */
  static ZERO = new Temperature(0, TemperatureUnit.KELVIN)
}
