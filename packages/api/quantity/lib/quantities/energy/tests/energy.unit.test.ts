import { describe, it } from 'node:test'
import { expect } from 'expect'
import { Energy } from '#lib/quantities/energy/energy.js'
import { EnergyUnit } from '#lib/quantities/energy/energy-unit.enum.js'
import { Duration } from '#lib/quantities/duration/duration.js'
import { DurationUnit } from '#lib/quantities/duration/duration-unit.enum.js'
import { PowerUnit } from '#lib/quantities/power/power-unit.enum.js'

void describe('Energy class', () => {
  void describe('Energy parsing', () => {
    void it('parses energy strings', () => {
      const energy = new Energy('1.25kWh')

      expect(energy.value).toBe(1.25)
      expect(energy.unit).toBe(EnergyUnit.KILOWATT_HOUR)
    })

    void it('parses calorie strings', () => {
      const energy = new Energy('250cal')

      expect(energy.value).toBe(250)
      expect(energy.unit).toBe(EnergyUnit.CALORIE)
    })

    void it('parses kilocalorie strings', () => {
      const energy = new Energy('2kcal')

      expect(energy.value).toBe(2)
      expect(energy.unit).toBe(EnergyUnit.KILOCALORIE)
    })
  })

  void describe('Energy conversion', () => {
    void it('converts calories to joules', () => {
      const energy = new Energy(1, EnergyUnit.CALORIE)

      expect(energy.asNumber(EnergyUnit.JOULE)).toBe(4.184)
    })

    void it('converts kilocalories to joules', () => {
      const energy = new Energy(1, EnergyUnit.KILOCALORIE)

      expect(energy.asNumber(EnergyUnit.JOULE)).toBe(4184)
    })

    void it('converts kilocalories to calories', () => {
      const energy = new Energy(1, EnergyUnit.KILOCALORIE)

      expect(energy.asNumber(EnergyUnit.CALORIE)).toBe(1000)
    })
  })

  void describe('Energy calculations', () => {
    void describe('cross quantity calculations', () => {
      void it('divides energies by durations into powers with converted units', () => {
        const energy = new Energy(1, EnergyUnit.KILOWATT_HOUR)
        const duration = new Duration(2, DurationUnit.HOURS)
        const power = energy.divide(duration)

        expect(power.isEqualTo(500, PowerUnit.WATT)).toBe(true)
      })
    })
  })
})
