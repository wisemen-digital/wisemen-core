import { describe, it } from 'node:test'
import { expect } from 'expect'
import { Duration } from '#lib/quantities/duration/duration.js'
import { DurationUnit } from '#lib/quantities/duration/duration-unit.enum.js'
import { EnergyUnit } from '#lib/quantities/energy/energy-unit.enum.js'
import { Power } from '#lib/quantities/power/power.js'
import { PowerUnit } from '#lib/quantities/power/power-unit.enum.js'

void describe('Power class', () => {
  void describe('Power parsing', () => {
    void it('parses power strings', () => {
      const power = new Power('0.5MW')

      expect(power.value).toBe(0.5)
      expect(power.unit).toBe(PowerUnit.MEGAWATT)
    })
  })

  void describe('Power calculations', () => {
    void describe('cross quantity calculations', () => {
      void it('multiplies powers with durations into energies with converted units', () => {
        const power = new Power(1.5, PowerUnit.KILOWATT)
        const duration = new Duration(30, DurationUnit.MINUTES)
        const energy = power.multiply(duration)

        expect(energy.isEqualTo(0.75, EnergyUnit.KILOWATT_HOUR)).toBe(true)
      })
    })
  })
})
