import { describe, it } from 'node:test'
import { expect } from 'expect'
import { Power } from '../power.js'
import { PowerUnit } from '../power-unit.enum.js'

void describe('Power class', () => {
  void describe('Power parsing', () => {
    void it('parses power strings', () => {
      const power = new Power('0.5MW')

      expect(power.value).toBe(0.5)
      expect(power.unit).toBe(PowerUnit.MEGAWATT)
    })
  })
})
