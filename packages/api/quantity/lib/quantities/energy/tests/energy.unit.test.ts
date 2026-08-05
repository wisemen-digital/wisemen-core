import { describe, it } from 'node:test'
import { expect } from 'expect'
import { Energy } from '../energy.js'
import { EnergyUnit } from '../energy-unit.enum.js'

void describe('Energy class', () => {
  void describe('Energy parsing', () => {
    void it('parses energy strings', () => {
      const energy = new Energy('1.25kWh')

      expect(energy.value).toBe(1.25)
      expect(energy.unit).toBe(EnergyUnit.KILOWATT_HOUR)
    })
  })
})
