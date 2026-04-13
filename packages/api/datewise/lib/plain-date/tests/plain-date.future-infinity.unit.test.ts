import { before, describe, it } from 'node:test'
import { expect } from 'expect'
import { FutureInfinityDate } from '../future-infinity-date.js'
import { DayjsPlainDate } from '../dayjs-plain-date.js'
import { PastInfinityDate } from '../past-infinity-date.js'
import { initDayjs } from '../../common/init-dayjs.js'
import { plainDate } from '../index.js'

describe('FutureInfinityDate', () => {
  before(() => initDayjs())

  describe('until', () => {
    it('returns zero duration when compared to itself', () => {
      const futureInfinity = new FutureInfinityDate()
      const duration = futureInfinity.until(futureInfinity)

      expect(duration.days).toBe(0)
    })

    it('returns zero duration when compared to another FutureInfinityDate', () => {
      const futureInfinity1 = new FutureInfinityDate()
      const futureInfinity2 = new FutureInfinityDate()
      const duration = futureInfinity1.until(futureInfinity2)

      expect(duration.days).toBe(0)
    })

    it('returns negative infinity when compared to a regular date', () => {
      const futureInfinity = new FutureInfinityDate()
      const regularDate = new DayjsPlainDate('2024-01-01')
      const duration = futureInfinity.until(regularDate)

      expect(duration.days).toBe(-Infinity)
    })

    it('returns negative infinity when compared to today', () => {
      const futureInfinity = new FutureInfinityDate()
      const duration = futureInfinity.until(plainDate.today())

      expect(duration.days).toBe(-Infinity)
    })

    it('returns negative infinity when compared to PastInfinityDate', () => {
      const futureInfinity = new FutureInfinityDate()
      const pastInfinity = new PastInfinityDate()
      const duration = futureInfinity.until(pastInfinity)

      expect(duration.days).toBe(-Infinity)
    })

    it('returns negative infinity when compared to a future date', () => {
      const futureInfinity = new FutureInfinityDate()
      const futureDate = new DayjsPlainDate().add(100, 'day')
      const duration = futureInfinity.until(futureDate)

      expect(duration.days).toBe(-Infinity)
    })
  })

  describe('since', () => {
    it('returns zero duration when compared to itself', () => {
      const futureInfinity = new FutureInfinityDate()
      const duration = futureInfinity.since(futureInfinity)

      expect(duration.days).toBe(0)
    })

    it('returns zero duration when compared to another FutureInfinityDate', () => {
      const futureInfinity1 = new FutureInfinityDate()
      const futureInfinity2 = new FutureInfinityDate()
      const duration = futureInfinity1.since(futureInfinity2)

      expect(duration.days).toBe(0)
    })

    it('returns positive infinity when compared to a regular date', () => {
      const futureInfinity = new FutureInfinityDate()
      const regularDate = new DayjsPlainDate('2024-01-01')
      const duration = futureInfinity.since(regularDate)

      expect(duration.days).toBe(Infinity)
    })

    it('returns positive infinity when compared to today', () => {
      const futureInfinity = new FutureInfinityDate()
      const duration = futureInfinity.since(plainDate.today())

      expect(duration.days).toBe(Infinity)
    })

    it('returns positive infinity when compared to PastInfinityDate', () => {
      const futureInfinity = new FutureInfinityDate()
      const pastInfinity = new PastInfinityDate()
      const duration = futureInfinity.since(pastInfinity)

      expect(duration.days).toBe(Infinity)
    })

    it('returns positive infinity when compared to a past date', () => {
      const futureInfinity = new FutureInfinityDate()
      const pastDate = new DayjsPlainDate().subtract(100, 'day')
      const duration = futureInfinity.since(pastDate)

      expect(duration.days).toBe(Infinity)
    })
  })
})
