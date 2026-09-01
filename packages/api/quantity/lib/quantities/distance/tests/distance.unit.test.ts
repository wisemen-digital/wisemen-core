import { describe, it } from 'node:test'
import { expect } from 'expect'
import { Area } from '../../area/area.js'
import { AreaUnit } from '../../area/area-unit.enum.js'
import { Distance } from '../distance.js'
import { DistanceUnit } from '../distance-unit.enum.js'
import { Duration } from '../../duration/duration.js'
import { DurationUnit } from '../../duration/duration-unit.enum.js'
import { SpeedUnit } from '../../speed/speed-unit.enum.js'
import { VolumeUnit } from '../../volume/volume-unit.enum.js'

void describe('Distance class', () => {
  void describe('Distance calculations', () => {
    void it('adds distances', () => {
      const d1 = new Distance(10, DistanceUnit.METER)
      const d2 = new Distance(50, DistanceUnit.CENTIMETER)
      const r: Distance = d1.add(d2)

      expect(r.isEqualTo(10.5, DistanceUnit.METER)).toBe(true)
    })

    void it('subtracts distances', () => {
      const d1 = new Distance(10, DistanceUnit.METER)
      const d2 = new Distance(50, DistanceUnit.CENTIMETER)
      const r: Distance = d1.subtract(d2)

      expect(r.isEqualTo(950, DistanceUnit.CENTIMETER)).toBe(true)
    })

    void it('divides distances', () => {
      const d1 = new Distance(1, DistanceUnit.METER)
      const d2 = new Distance(25, DistanceUnit.CENTIMETER)

      const r1: Distance = d1.divide(2)
      const r2: number = d1.divide(d2)
      const r3: number = d1.divide(0.5, DistanceUnit.METER)

      expect(r1.isEqualTo(50, DistanceUnit.CENTIMETER)).toBe(true)
      expect(r2).toBe(4)
      expect(r3).toBe(2)
    })

    void it('multiplies distances into areas', () => {
      const width = new Distance(5, DistanceUnit.METER)
      const height = new Distance(200, DistanceUnit.CENTIMETER)
      const area = width.multiply(height)

      expect(area.isEqualTo(10, AreaUnit.SQUARE_METER)).toBe(true)
    })

    void it('multiplies distances by areas into volumes', () => {
      const distance = new Distance(2, DistanceUnit.METER)
      const area = new Area(5000, AreaUnit.SQUARE_CENTIMETER)
      const result = distance.multiply(area)

      expect(result.isEqualTo(1, VolumeUnit.CUBIC_METER)).toBe(true)
    })
  
    void describe('cross quantity calculations', () => {
      void it('divides distances by durations into speeds with converted units', () => {
        const distance = new Distance(10, DistanceUnit.KILOMETER)
        const duration = new Duration(2, DurationUnit.HOURS)
        const speed = distance.divide(duration)

        expect(speed.isEqualTo(5, SpeedUnit.KILOMETER_PER_HOUR)).toBe(true)
      })
    })
  })

  void describe('Distance parsing', () => {
    void it('parses distance strings', () => {
      const distance = new Distance('12μm')

      expect(distance.value).toBe(12)
      expect(distance.unit).toBe(DistanceUnit.MICROMETER)
    })
  })
})
