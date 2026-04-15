import {
  TemperatureDto,
  TemperatureUnit,
} from '@wisemen/quantity'
import {
  describe,
  expect,
  it,
} from 'vitest'

import { Temperature } from './temperature.model'

describe('temperature', () => {
  describe('constructor', () => {
    it('creates a temperature with value and unit', () => {
      const temp = new Temperature(25, TemperatureUnit.CELSIUS)

      expect(temp.value).toBe(25)
      expect(temp.unit).toBe(TemperatureUnit.CELSIUS)
    })
  })

  describe('getValueIn', () => {
    it('returns the value in the same unit', () => {
      const temp = new Temperature(25, TemperatureUnit.CELSIUS)

      expect(temp.getValueIn(TemperatureUnit.CELSIUS)).toBe(25)
    })

    it('converts celsius to fahrenheit', () => {
      const temp = new Temperature(0, TemperatureUnit.CELSIUS)

      expect(temp.getValueIn(TemperatureUnit.FAHRENHEIT)).toBe(32)
    })

    it('converts celsius to kelvin', () => {
      const temp = new Temperature(0, TemperatureUnit.CELSIUS)

      expect(temp.getValueIn(TemperatureUnit.KELVIN)).toBe(273.15)
    })

    it('converts celsius to milli degree celsius', () => {
      const temp = new Temperature(25, TemperatureUnit.CELSIUS)

      expect(temp.getValueIn(TemperatureUnit.MILLI_DEGREE_CELSIUS)).toBe(25_000)
    })
  })

  describe('toDto', () => {
    it('returns a TemperatureDto', () => {
      const temp = new Temperature(25, TemperatureUnit.CELSIUS)
      const dto = temp.toDto()

      expect(dto).toBeInstanceOf(TemperatureDto)
      expect(dto.value).toBe(25)
      expect(dto.unit).toBe(TemperatureUnit.CELSIUS)
    })
  })

  describe('toString', () => {
    it('formats celsius', () => {
      const temp = new Temperature(25.36, TemperatureUnit.CELSIUS)

      expect(temp.toString(TemperatureUnit.CELSIUS)).toBe('25.4°C')
    })

    it('formats fahrenheit', () => {
      const temp = new Temperature(100, TemperatureUnit.FAHRENHEIT)

      expect(temp.toString(TemperatureUnit.FAHRENHEIT)).toBe('100°F')
    })

    it('converts and formats to a different unit', () => {
      const temp = new Temperature(0, TemperatureUnit.CELSIUS)

      expect(temp.toString(TemperatureUnit.FAHRENHEIT)).toBe('32°F')
    })

    it('uses the stored unit when no unit is provided', () => {
      const temp = new Temperature(25, TemperatureUnit.CELSIUS)

      expect(temp.toString()).toBe('25°C')
    })
  })
})
