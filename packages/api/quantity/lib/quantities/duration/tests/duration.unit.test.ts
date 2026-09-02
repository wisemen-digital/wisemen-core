import { describe, it } from 'node:test'
import { expect } from 'expect'
import { Duration } from '../duration.js'
import { DurationUnit } from '../duration-unit.enum.js'
import { DistanceUnit } from '../../distance/distance-unit.enum.js'
import { Speed } from '../../speed/speed.js'
import { SpeedUnit } from '../../speed/speed-unit.enum.js'

describe('Duration unit tests', () => {
  describe('milliseconds', () => {
    it('reports the correct amount of seconds', () => {
      const duration = new Duration(1, DurationUnit.HOURS)

      expect(duration.milliseconds).toBe(3600_000)
    })
  })

  describe('seconds', () => {
    it('reports the correct amount of seconds', () => {
      const duration = new Duration(1, DurationUnit.HOURS)

      expect(duration.seconds).toBe(3600)
    })
  })

  describe('minutes', () => {
    it('reports the correct amount of seconds', () => {
      const duration = new Duration(1, DurationUnit.HOURS)

      expect(duration.minutes).toBe(60)
    })
  })

  describe('hours', () => {
    it('reports the correct amount of seconds', () => {
      const duration = new Duration(1, DurationUnit.HOURS)

      expect(duration.hours).toBe(1)
    })
  })

  describe('parsing', () => {
    it('parses duration strings', () => {
      const duration = new Duration('2days')

      expect(duration.value).toBe(2)
      expect(duration.unit).toBe(DurationUnit.DAYS)
    })
  })

  describe('Duration calculations', () => {
    describe('cross quantity calculations', () => {
      it('multiplies durations with speeds into distances with converted units', () => {
        const duration = new Duration(30, DurationUnit.MINUTES)
        const speed = new Speed(72, SpeedUnit.KILOMETER_PER_HOUR)
        const distance = duration.multiply(speed)

        expect(distance.isEqualTo(36, DistanceUnit.KILOMETER)).toBe(true)
      })
    })
  })
})
