import { describe, it } from 'node:test'
import { expect } from 'expect'
import { Distance } from '../../distance/distance.js'
import { DistanceUnit } from '../../distance/distance-unit.enum.js'
import { VolumeUnit } from '../../volume/volume-unit.enum.js'
import { Area } from '../area.js'
import { AreaUnit } from '../area-unit.enum.js'

void describe('Area class', () => {
  void describe('Area calculations', () => {
    void it('adds areas', () => {
      const a1 = new Area(10, AreaUnit.SQUARE_METER)
      const a2 = new Area(5000, AreaUnit.SQUARE_CENTIMETER)
      const result = a1.add(a2)

      expect(result.isEqualTo(10.5, AreaUnit.SQUARE_METER)).toBe(true)
    })

    void it('divides areas by distances into distances with converted units', () => {
      const area = new Area(1, AreaUnit.HECTARE)
      const distance = new Distance(50, DistanceUnit.METER)
      const result = area.divide(distance)

      expect(result.isEqualTo(200, DistanceUnit.METER)).toBe(true)
    })

    void it('multiplies areas by distances into volumes', () => {
      const area = new Area(2, AreaUnit.SQUARE_METER)
      const distance = new Distance(50, DistanceUnit.CENTIMETER)
      const result = area.multiply(distance)

      expect(result.isEqualTo(1, VolumeUnit.CUBIC_METER)).toBe(true)
    })
  })

  void describe('Area parsing', () => {
    void it('parses area strings', () => {
      const area = new Area('12m²')

      expect(area.value).toBe(12)
      expect(area.unit).toBe(AreaUnit.SQUARE_METER)
    })
  })
})
