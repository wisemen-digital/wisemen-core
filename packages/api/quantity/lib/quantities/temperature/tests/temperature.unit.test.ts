import { describe, it } from 'node:test'
import { expect } from 'expect'
import { Temperature } from '../temperature.js'
import { TemperatureUnit } from '../temperature-unit.enum.js'

void describe('Temperature class', () => {
  void describe('Temperature parsing', () => {
    void it('parses temperature strings', () => {
      const temperature = new Temperature('-40C')

      expect(temperature.value).toBe(-40)
      expect(temperature.unit).toBe(TemperatureUnit.CELSIUS)
    })
  })
})
