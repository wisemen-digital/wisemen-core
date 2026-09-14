import { describe, it } from 'node:test'
import { expect } from 'expect'
import { Temperature, TemperatureDelta } from '#lib/quantities/temperature/temperature.js'
import { TemperatureUnit } from '#lib/quantities/temperature/temperature-unit.enum.js'

void describe('Temperature class', () => {
  void describe('Temperature parsing', () => {
    void it('parses temperature strings', () => {
      const temperature = new Temperature('-40C')

      expect(temperature.value).toBe(-40)
      expect(temperature.unit).toBe(TemperatureUnit.CELSIUS)
    })
  })

  void describe('Temperature calculations', () => {
    void it('adds temperatures', () => {
      const T1 = new Temperature(20, TemperatureUnit.CELSIUS)
      const T2 = new TemperatureDelta(5, TemperatureUnit.KELVIN)
      const r: Temperature = T1.add(T2)

      expect(r.isEqualTo(25, TemperatureUnit.CELSIUS)).toBe(true)
    })

    void it('subtracts temperatures', () => {
      const T1 = new Temperature(20, TemperatureUnit.CELSIUS)
      const T2 = new Temperature(5, TemperatureUnit.KELVIN)
      const T3 = new TemperatureDelta(5, TemperatureUnit.KELVIN)
      const r1: TemperatureDelta = T1.subtract(T2)
      const r2: Temperature = T1.subtract(T3)

      expect(r1.isEqualTo(288.15, TemperatureUnit.CELSIUS)).toBe(true)
      expect(r2.isEqualTo(15, TemperatureUnit.CELSIUS)).toBe(true)
    })
  })
})
